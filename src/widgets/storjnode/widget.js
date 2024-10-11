import genericProxyHandler from "utils/proxy/handlers/generic"; 

const widget =  {
  api: "{url}/api/{endpoint}" ,
  proxyHandler: genericProxyHandler ,

  mappings: {
    payout: {
      endpoint: "sno/estimated-payout" ,
    },
  },
};

export default widget;

