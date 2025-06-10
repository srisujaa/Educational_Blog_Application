import React, { Fragment } from "react";
import { Container, Row, Col, Button } from "reactstrap";
import { Link } from "react-router-dom";

import Header from "../components/Header/Header";
import HeroSection from "../components/Hero-Section/HeroSection";
import CompanySection from "../components/Company-section/Company";
import AboutUs from "../components/About-us/AboutUs";
import ChooseUs from "../components/Choose-us/ChooseUs";
import Features from "../components/Feature-section/Features";
import BrainBreak from "../components/BrainBreak/BrainBreak";
import Footer from "../components/Footer/Footer";
import "./Home.css";

const Home = () => {
  return (
    <Fragment>
      <Header />
      <HeroSection id="home" />
     
      <AboutUs id="about" />
      <ChooseUs id="pages" />
      <Features id="blog" />
      <BrainBreak id="brain-break" />
      
      <Footer />
    </Fragment>
  );
};

export default Home;
