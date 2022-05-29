const isClosed = (auction: Auction) => {
    let now = new Date();
    let endDate = new Date(auction.endDate);

    let elapsed = endDate.getTime() - now.getTime();
    return elapsed <= 0;
}

export {isClosed};