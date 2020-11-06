export interface County {
    county: string
    lowerRemainingVotes: number
    upperRemainingVotes: number
    total: number
    trump: number
    biden: number
    jorgensen: number
}

export interface CountyAggregate {
    lowerRemainingVotes: number
    upperRemainingVotes: number
    estimatedBidenLowerVotes: number
    estimatedTrumpLowerVotes: number
    estimatedBidenUpperVotes: number
    estimatedTrumpUpperVotes: number
}
