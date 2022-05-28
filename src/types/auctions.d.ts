type Auction = {
    auctionId: number,
    title: string,
    categoryId: number,
    sellerId: number,
    sellerFirstName: string,
    sellerLastName: string,
    reserve: number,
    numBids: number,
    highestBid: number,
    endDate: string
}

type FullAuction = {
    auctionId: number,
    title: string,
    categoryId: number,
    sellerId: number,
    sellerFirstName: string,
    sellerLastName: string,
    reserve: number,
    numBids: number,
    highestBid: number,
    endDate: string,
    description: string
}

type Bid = {
    bidderId: number,
    amount: number,
    firstName: string,
    lastName: string,
    timestamp: string
}