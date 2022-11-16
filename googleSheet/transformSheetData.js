function transformSheetData(data){
    const amountColumns = data[0].length
    const amountRows = data.length
    let participants =  {}
    let newData = {}
    let countries = []
    console.log("columns", amountColumns)
    console.log("rows", amountRows)
    // get names of participants
    let nameColumn = 8

    while (nameColumn < amountColumns){
        // console.log("participant", data[0][nameColumn-1])
        // participants.push(data[0][nameColumn-1])
        participants[data[0][nameColumn-1]] = {
            totalResult: data[1][nameColumn],
            totalPenalty: data[1][nameColumn+1],
        }
        nameColumn += 3
    }
    console.log("participants", participants)


    // work with all data
    for (let row = 0; row < amountRows; row++){
        for (let column = 0; column < amountColumns; column++){
            const elemIndex = row * amountColumns + column
            // console.log("index", row* amountColumns + column)
            if (row > 1){
                newData[elemIndex] = {
                    row: row,
                    column: column
                }
                // row Index
                if (column === 0){
                    newData[elemIndex].rowIndex = undefinedToNull(data[row][column])
                }
                // Data of match
                if (column === 1){
                    newData[elemIndex].matchDate = undefinedToNull(data[row][column])
                }
                // Match status
                if (column === 2){
                    newData[elemIndex].matchStatus = undefinedToNull(data[row][column])
                }
                // Command 1
                if (column === 3){
                    newData[elemIndex].command1 = undefinedToNull(data[row][column])
                    // check for new country
                    if (data[row][column] !== undefined){
                        if (!countries.find(country => country === data[row][column])){
                            countries.push(data[row][column])
                        }
                    }
                }
                // Command 2
                if (column === 4){
                    newData[elemIndex].command2 = undefinedToNull(data[row][column])
                    // check for new country
                    if (data[row][column] !== undefined){
                        if (!countries.find(country => country === data[row][column])){
                            countries.push(data[row][column])
                        }
                    }

                }
                // Round
                if (column === 5){
                    newData[elemIndex].round = undefinedToNull(data[row][column])
                }
                // Match result
                if (column === 6){
                    newData[elemIndex].matchResult = undefinedToNull(data[row][column])
                }
                // participants data processing
                if (column > 6){
                    // console.log("column", column, row, (column - 7) % 3)
                    newData[elemIndex].participant = data[0][column - (column - 7) % 3]
                    // player's prediction
                    if ((column - 7) % 3 === 0){
                        newData[elemIndex].prediction = undefinedToNull(data[row][column])
                    }
                    // player's points
                    if ((column - 7) % 3 === 1){
                        newData[elemIndex].point = undefinedToNull(data[row][column])
                    }
                    // player's penalty points
                    if ((column - 7) % 3 === 2){
                        newData[elemIndex].penalty = undefinedToNull(data[row][column])
                    }
                }

            }

        }
    }
    console.log(newData)
    countries = countries.sort()
    // console.log("countries", countries)
    return {
        participants: participants,
        countries: countries,
        tableData: {
            amountRows: amountRows,
            amountColumns: amountColumns,
            table: newData
        }
    }
}


function undefinedToNull(checkElem){
    if (checkElem === undefined){
        return null
    }
    return checkElem
}

module.exports =  transformSheetData