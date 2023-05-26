class APIFeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  search() {
    const keyword = this.queryStr.keyword
      ? {
          name: {
            $regex: this.queryStr.keyword,
            $options: "i",
          },
          // address: {
          //   $regex: this.queryStr.keyword,
          //   $options: "i",
          // },
        }
      : {};

    this.query = this.query.find({ ...keyword });
    return this;
  }

  filter() {
    const queryCopy = { ...this.queryStr };

    // removing fields from the query
    const removefields = ["keyword", "limit", "page"];
    removefields.forEach((el) => delete queryCopy[el]);

    let queryStr = JSON.stringify(queryCopy);
    // adding "$" sign in Mongo operator "greater = gt or gte" and "smaller = lt ot lte"
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (match) => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  pagination(resPerPage) {
    const currentPage = Number(this.queryStr.page) || 1;
    // abhi ham kis page per hai
    const skip = resPerPage * (currentPage - 1);
    // {skip} kya kare ga ki kitne product ke baad se start karna hai
    // example agar ham {3} page par hai to
    // currentPage = 3,
    // {skip} == 4*(3-1) == 4*2 == 8 to ham {9} product se show karenge page {3} pe
    this.query = this.query.limit(resPerPage).skip(skip);
    // products ko limit kardo {resPerPage} tak yani {4} tak
    // Matlab ki sirf {4} product hi show karo
    return this;
    // aur fir jo result aayega to use show kardo
  }
}

module.exports = APIFeatures;
