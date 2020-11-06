import { County, CountyAggregate } from "@interface"

export const parseTableHTML = (htmlStr: string): string[] => {
    const tbody = htmlStr.slice(htmlStr.indexOf('<tbody>') + '<tbody>'.length, htmlStr.length - '</tbody>'.length).trim()
    return tbody.split('</tr>').map(s => 
        s.replace('&gt;', '')
         .replace(',', '')
         .replace(/<\/?span[^>]*>/g, '')
         .replace(/<!-*>/g, '')
         .replace('Estimated ', '')
         .replace('<tr><td>', '')
         .replace(/<\/td><td>/g, ',')
         .replace(/<\/td>/g, '')
         .replace(/\n[^\d]*/g, ',')
         .replace(',,', ',')
         .slice(0, -1)
    ).slice(0, -1)
}

const parsePct = (pctStr: string): number => {
    const isSingleDigit = pctStr.split('.')[0]?.length === 1

    let stripped = pctStr.slice(0, -1).replace('.', '')
    if (isSingleDigit) stripped = `0${stripped}`
    return parseFloat(`.${stripped}`)
}

const parseRange = (rangeStr: string): [number, number] => {
    const [lower, upper] = rangeStr.split('-').map(s => parsePct(s.trim()))
    return [lower, upper]
}

export const parseCounties = (input: string[]): County[] => input.map(raw => {
    const split = raw.split(',')
    const county = split[0]
    const total = parseInt(split[2])
    const trump = parsePct(split[3])
    const biden = parsePct(split[4])
    const jorgensen = parsePct(split[5])
    
    let lowerRemainingVotes, upperRemainingVotes
    const range = split[1].indexOf('-') !== -1
    if (range) {
        const [lowerPct, upperPct] = parseRange(split[1])
        lowerRemainingVotes = (total / upperPct) - total
        upperRemainingVotes = (total / lowerPct) - total
        console.log(county, total, lowerPct, upperPct, lowerRemainingVotes, upperRemainingVotes)
    } else {
        const remaining = total / parsePct(split[1]) - total
        lowerRemainingVotes = remaining
        upperRemainingVotes = remaining
    }

    return {
        county,
        lowerRemainingVotes,
        upperRemainingVotes,
        total,
        trump,
        biden,
        jorgensen,
    }
})

const zeroedAggregate: CountyAggregate = {
    lowerRemainingVotes: 0,
    upperRemainingVotes: 0,
    estimatedBidenLowerVotes: 0,
    estimatedTrumpLowerVotes: 0,
    estimatedBidenUpperVotes: 0,
    estimatedTrumpUpperVotes: 0,
}

export const aggregateCounties = (counties: County[]): CountyAggregate => counties.reduce((agg, curr) => {
    agg.lowerRemainingVotes = agg.lowerRemainingVotes + curr.lowerRemainingVotes
    agg.upperRemainingVotes = agg.upperRemainingVotes + curr.upperRemainingVotes
    agg.estimatedBidenLowerVotes = agg.estimatedBidenLowerVotes + (curr.total * curr.biden) + (curr.lowerRemainingVotes * curr.biden)
    agg.estimatedTrumpLowerVotes = agg.estimatedTrumpLowerVotes + (curr.total * curr.trump) + (curr.lowerRemainingVotes * curr.trump)
    agg.estimatedBidenUpperVotes = agg.estimatedBidenUpperVotes + (curr.total * curr.biden) + (curr.upperRemainingVotes * curr.biden)
    agg.estimatedTrumpUpperVotes = agg.estimatedTrumpUpperVotes + (curr.total * curr.trump) + (curr.upperRemainingVotes * curr.trump)

    return agg
}, zeroedAggregate)