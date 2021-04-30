 const eventType = {
  ASK: 'ASK',
  ACTIVITY: 'ACTIVITY'
}
const postMessage = {
  url: '*',
  send(data = {}) {
    window.parent.postMessage(data, this.url)
  },
  sendAsk(data) {
    let postData = {
      eventType: eventType.ASK,
      ...data
    }
    this.send(JSON.stringify(postData))
  },
  sendActivity(data) {
    let postData = {
      eventType: eventType.ACTIVITY,
      ...data
    }
    this.send(JSON.stringify(postData))
  }
}
export default postMessage
