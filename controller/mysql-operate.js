class Operate {
  async insert (table, data) {
    let createLog = await table.create(data)
    console.log('created: ' + JSON.stringify(createLog))
  }
  async query (table, query) {
    let response = await table.findAll(query)
    console.log(`${response.length}`)
  }
}
export {
  Operate
}
