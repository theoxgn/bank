'use strict'
class MessageHelper {

    async showMessage(code = 200, arr = {}, json = true, res) {
      try {
        const msg = await this.getHttpMessage(code);
        const arrReturn = {
          Message: {
            Code: code,
            Text: msg,
          },
          ...arr,
        };
        return json ? res.status(code).send(arrReturn) : res.status(code).send(JSON.stringify(arrReturn));
      } catch (error) {
          console.error('Error fetching message:', error);
        res.status(500).send({ Error: 'Failed to retrieve message' }); // Handle error response
      }
      
    }
    
      
  
    async getHttpMessage(code) {
      const statusCodes = {
        100: "Continue",
        101: "Switching Protocols",
        200: "OK",
        201: "Created",
        202: "Accepted",
        203: "Non-Authoritative Information",
        204: "No Content",
        205: "Reset Content",
        206: "Partial Content",
        301: "Moved Permanently",
        302: "Found",
        303: "See Other",
        304: "Not Modified",
        305: "Use Proxy",
        307: "Temporary Redirect",
        400: "Bad Request",
        401: "Unauthorized",
        403: "Forbidden",
        404: "Not Found",
        405: "Method Not Allowed",
        406: "Not Acceptable",
        407: "Proxy Authentication Required",
        408: "Request Timeout",
        409: "Conflict",
        410: "Gone",
        411: "Length Required",
        412: "Precondition Failed",
        413: "Request Entity Too Large",
        414: "Request-URI Too Long",
        415: "Unsupported Media Type",
        416: "Request Range Not Satisfiable",
        417: "Expectation Failed",
        422: "Unprocessable Entity",
        429: "Too Many Requests",
        500: "Internal Server Error",
        501: "Not Implemented",
        502: "Bad Gateway",
        503: "Service Unavailable",
        504: "Gateway Timeout",
        505: "HTTP Version Not Supported",
      };
      return statusCodes[code] || "";
    }
}

module.exports = new MessageHelper()