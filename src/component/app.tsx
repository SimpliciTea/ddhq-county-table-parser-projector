import * as React from 'react'
import { style } from 'typestyle'
import { htmlString } from '../data'
import { parseTableHTML, parseCounties, aggregateCounties } from '../util'

const headerClass = style({
    fontFamily: 'sans-serif',
})

export const App: React.FC = () => {
    const rows = parseTableHTML(htmlString)
    console.log(parseTableHTML(htmlString))

    const parsedCounties = parseCounties(rows)
    console.log(parsedCounties)

    const aggregatedCounties = aggregateCounties(parsedCounties)
    console.log(aggregatedCounties)

    return (
        <h1 className={headerClass}>Hello, typescript!</h1>
    )
}