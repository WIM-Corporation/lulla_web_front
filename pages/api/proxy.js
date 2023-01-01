import axios from "axios";

export default async function proxy(req, res) {
  try {
    const response = await axios(req.body.options);
    res.end(JSON.stringify(response.data));
  } catch (error) {
    res.end(JSON.stringify(error));
  }
}