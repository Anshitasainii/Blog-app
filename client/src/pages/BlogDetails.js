import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Button, InputLabel, TextField, Typography } from "@mui/material";
import { BASE_URL } from "../constants/BASE_URL";

const BlogDetails = () => {
  const [blog, setBlog] = useState(null); // null as initial, since no blog yet
  const id = useParams().id;
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({
    title: "",
    description: "",
    image: "",
  });

  // Use useCallback to memoize getBlogDetail so it's stable for useEffect
  const getBlogDetail = useCallback(async () => {
    try {
      const { data } = await axios.get(`${BASE_URL}/api/v1/blog/${id}`); // use GET here, not PUT
      if (data?.success) {
        setBlog(data.blog);
        setInputs({
          title: data.blog.title,
          description: data.blog.description,
          image: data.blog.image,
        });
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch blog details");
    }
  }, [id]);

  useEffect(() => {
    getBlogDetail();
  }, [getBlogDetail]);

  const handleChange = (e) => {
    setInputs((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = `${BASE_URL}/api/v1/blog/update-blog/${id}`;
      const bodyData = {
        title: inputs.title,
        description: inputs.description,
        image: inputs.image,
        user: id, // check if user id should be here, maybe not
      };

      const res = await axios.put(url, bodyData);

      if (res.data?.success) {
        toast.success("Blog Updated");
        navigate("/my-blogs");
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to update blog");
    }
  };

  if (!blog) {
    return <Typography variant="h6" textAlign="center" mt={4}>Loading...</Typography>;
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <Box
          width={"50%"}
          border={3}
          borderRadius={10}
          padding={3}
          margin="auto"
          boxShadow={"10px 10px 20px #ccc"}
          display="flex"
          flexDirection={"column"}
          marginTop="30px"
        >
          <Typography
            variant="h2"
            textAlign={"center"}
            fontWeight="bold"
            padding={3}
            color="gray"
          >
            Update A Post
          </Typography>

          <InputLabel sx={{ mb: 1, mt: 2, fontSize: "24px", fontWeight: "bold" }}>
            Title
          </InputLabel>
          <TextField
            name="title"
            value={inputs.title}
            onChange={handleChange}
            margin="normal"
            variant="outlined"
            required
          />

          <InputLabel sx={{ mb: 1, mt: 2, fontSize: "24px", fontWeight: "bold" }}>
            Description
          </InputLabel>
          <TextField
            name="description"
            value={inputs.description}
            onChange={handleChange}
            margin="normal"
            variant="outlined"
            required
          />

          <InputLabel sx={{ mb: 1, mt: 2, fontSize: "24px", fontWeight: "bold" }}>
            Image URL
          </InputLabel>
          <TextField
            name="image"
            value={inputs.image}
            onChange={handleChange}
            margin="normal"
            variant="outlined"
            required
          />

          <Button type="submit" color="warning" variant="contained">
            UPDATE
          </Button>
        </Box>
      </form>
    </>
  );
};

export default BlogDetails;
