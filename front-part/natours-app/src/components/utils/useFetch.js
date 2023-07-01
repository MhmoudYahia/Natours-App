import { useState, useEffect } from "react";

export const useFetch = (url) => {
  const [data, setData] = useState([]);
  const [status, setSt] = useState(0);
  const [message, setMess] = useState("");
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setData(data.data);
        setSt(data.status);
        setMess(data.message);
        setLoading(false);
      });
  }, [url]);
  return { status, data, message, loading };
};