import pkg from '@prisma/client';
const { PrismaClient } = pkg;
import puppeteer from 'puppeteer';


const prisma = new PrismaClient();

export default {
async CreateBookPdf(req, res) {
    const { bookId } = req.params;

    
    const bookData = await prisma.book.findUnique({ where: { id: Number(bookId) } });
    
    if(!!bookData){
        const chapters = await prisma.chapter.findMany({ where: { bookId: Number(bookId) }, include: {map: true} });


        const chaptersWithExpPoints = []
        
        if(Array.isArray(chapters) && chapters.length > 0){
    
            const promises = chapters.map(c=>c.id).map( cId =>(
                    prisma.explorationPoint.findMany({ where: { chapterId: Number(cId) } })
                )
            )
    
            const capExplorationPoints = await Promise.all(promises);
    
            
            const previousExplorationPointsRelationArr = await Promise.all(
                capExplorationPoints.map(async (cap, index) => {
                  const promises2 = cap.map((expPoint) => {
                    return prisma.explorationPointPreviousRelation.findMany({ where: { nextPointId: expPoint.id } })
                  });
                  return Promise.all(promises2);
                })
              );
    
            
            await chapters.map((c,index) => {
    
                chaptersWithExpPoints.push({
                    ...c,
                    relations: previousExplorationPointsRelationArr[index].filter(subArr=>subArr.length > 0).flat(),
                    explorationPoints: capExplorationPoints[index].map((expPoint,index2) => {
                        return (
                            {...expPoint}
                        )
                    }),
                    initialPoints: capExplorationPoints[index].map((expPoint,index2) => {
                        return (
                            {...expPoint}
                        )
                    }).filter(e=>(
                        !(previousExplorationPointsRelationArr[index].filter(subArr=>subArr.length > 0).flat().map(e=>e.nextPointId).includes(e.id))
                    )),
                    
                    
                })
            })
    
        }
    
        function contarLetrasAteNumero(numero) {
            const resultado = [];
            const alfabeto = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
            
            for (let i = 1; i <= numero; i++) {
              let atual = i - 1;
              let contagem = '';
              
              do {
                contagem = alfabeto[atual % 26] + contagem;
                atual = Math.floor(atual / 26) - 1;
              } while (atual >= 0);
              
              resultado.push(contagem);
            }
            
            return resultado[resultado.length - 1];
        }
    
        const expPointsHtmlArr = chaptersWithExpPoints.map((chapter, chapterIdx) => `
            <div>
                <h2>${(chapterIdx+1)+".0 " + chapter.name}</h2>
                ${chapter.introduction.length > 0 ?
                    `
                        <h3>Introdução</h3>
                        <p style=" white-space: pre-wrap ;">${chapter.introduction}</p>    
                    `
                    : ""
                }
                
                
                <h3>Preparação</h3>
                <p>
                Coloque o Cenário ${chapter.map.name} no centro do jogo e distribua os seguintes marcadores:
                ${chapter.initialPoints.map((expPoint, idx) => (expPoint.code +  " no espaço " + contarLetrasAteNumero(expPoint.xPosition) + expPoint.yPosition + (idx === chapter.initialPoints.length - 1 ? "." : (idx === chapter.initialPoints.length - 2 ? " e " : ", ")))).join('')}
                Os investigadores iniciam na posição ${contarLetrasAteNumero(chapter.initialXPoint) + chapter.initialYPoint}.
                </p>            
                ${chapter.explorationPoints.map((expPoint, expPtIdx) => (`
                    <h3>${expPoint.name}</h3>
                    <p style=" white-space: pre-wrap ;">${expPoint.pointIntroductionText}</p>
                    ${ expPoint.type === "text" ?
                        `<p style=" white-space: pre-wrap ;">${expPoint.pointChallangeText}</p>`
                        : ""
                    }
                    ${ expPoint.type === "individual-challange" ?
                        `<p>
                            <b>DESAFIO INDIVIDUAL: </b> faça um teste ${expPoint.diceAmout} | ${expPoint.diceMinValueToSuccess} | ${expPoint.diceAmoutToSuccess}
                        </p>`
                            : ""
                    }
                    ${ expPoint.type === "group-challange" ?
                        `<p>
                            <b>DESAFIO EM GRUPO: </b> faça um teste ${expPoint.diceAmout} | ${expPoint.diceMinValueToSuccess} | ${expPoint.diceAmoutToSuccess}
                        </p>`
                            : ""
                    }


                    ${expPoint.successText.length > 0 ?
                        `

                            <p style=" white-space: pre-wrap ;"><b>SUCESSO: </b>${expPoint.successText}</p>
                        `
                        : ""
                    }
                    ${expPoint.failText.length > 0 ?
                        `
                            <p style=" white-space: pre-wrap ;"><b>FRACASSO: </b>${expPoint.failText}</p>
                        `
                        : ""
                    }
                `)).join('')}
            </div>
        `);
    
        // Crie um HTML para o PDF
        const html = `
            <html>
            <body>
                <div style="column-count: 2; column-fill: auto; word-wrap: break-word; margin-left: 20px; margin-right: 20px; text-align: justify;">
                    ${chapters.map((chapter,index)=>
                        `
                            ${
                                expPointsHtmlArr[index]
                            }
                        `
                    ).join('')}
                </div>
            </body>
            </html>
        `;
    
        // Crie um PDF usando puppeteer
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.setContent(html, { waitUntil: 'networkidle0' });
        const pdf = await page.pdf({
            format: 'A4',
            displayHeaderFooter: true,
            headerTemplate: `
            <div style="width: 100%;">
                <b style="text-align: center; font-size: 20px;">____________________________________________________________________________________________</b>
                <div style="width: 100%; padding: 20px 30px 0 30px; box-sizing: border-box;">
                    <span style="float: left; font-size: 20px;">${bookData.name}</span>
                    <span style="float: right; font-size: 20px;"><span class="pageNumber"></span> / <span class="totalPages"></span></span>            
                </div>
                <b style="text-align: center; font-size: 20px;">____________________________________________________________________________________________</b>
            </div>`,
            footerTemplate: `<div></div>`,
            margin: {
              top: '100px', // default is 0, you can set the value as per your requirement
              bottom: '60px', // default is 0, you can set the value as per your requirement
            },
          });
        await browser.close();


        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'inline; filename=book.pdf');
        res.send(pdf);
    }
    else{
        return res.json({ error: "Livro inexistente" }); 
    }

    },

};
