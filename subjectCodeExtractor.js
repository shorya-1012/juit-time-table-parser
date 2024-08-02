"use server"
import ExcelJs from 'exceljs'
import { writeFile } from 'fs'

const writeSubjectCode = async () => {
    console.log("function ran")
    const workbook = new ExcelJs.Workbook();
    await workbook.xlsx.readFile("./subject-code.xlsx");
    console.log("file opened")

    let data = []

    workbook.eachSheet((sheet, _id) => {
        console.log(sheet);
        data[sheet.name] = [];
        sheet.eachRow((row, _rowNumber) => {
            let cellData = {};
            row.eachCell((cell, colNumber) => {
                const cellValue = String(cell.value);
                if (cellValue) {
                    if (colNumber === 6) {
                        cellData["code"] = cellValue
                    } else if (colNumber == 7) {
                        cellData["courseName"] = cellValue.replace(/ /g, '-')
                    }
                }
            })
            data.push(cellData);
        })
    })

    let courseNameMap = {};
    data.map(value => {
        courseNameMap[value?.code] = value?.courseName
    })

    const jsonData = JSON.stringify(courseNameMap, null, 2);
    const filePath = "./course-name.js"
    writeFile(filePath, `export const courseNames= ${jsonData}`, (err) => {
        if (err) {
            console.log(err)
        } else {
            console.log("data written")
        }
    })
}

writeSubjectCode();
