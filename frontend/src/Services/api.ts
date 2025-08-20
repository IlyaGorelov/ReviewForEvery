export let api = "";
if (process.env.NODE_ENV == "development") api = "http://localhost:5257/api/";
else api = "https://reviewforevery-production.up.railway.app/api/";
