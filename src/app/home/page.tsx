"use client";

import Image from "next/image";
// import "./App.css";
import { useState } from "react";
import bigimg from "../../../public/img/big-img.png";
import book from "../../../public/img/book.png";
import bulb from "../../../public/img/bulb.png";
import facebook from "../../../public/img/facebook.png";
import flower from "../../../public/img/flower.png";
import logo from "../../../public/img/img/logo.png";
import linkedin from "../../../public/img/linkedin.png";
import rotate from "../../../public/img/rotate.png";
import twitter from "../../../public/img/twitter.png";

export default function HomePage() {
  const [_activeTab, _setActiveTab] = useState("tab1");

  const _tabs = [
    {
      id: "tab1",
      title: "What is Crevy?",
      content: [
        "Carbon credits are certificates that represent one ton of CO₂ removed from the atmosphere. Companies worldwide buy these credits to offset their emissions and meet climate goals.",
        " Crevy is a platform that helps climate projects turn their environmental impact into verified carbon credits. We guide you through every step - from calculating your carbon savings to getting internationally certified and connecting with buyers.",
        "Whether you're running clean cookstove programs, reforestation projects, solar installations, or regenerative farming initiatives, Crevy makes carbon certification accessible and profitable",
      ],
    },
    {
      id: "tab2",
      title: "The Solution",
      content: [
        "This is the first paragraph of the overview.",
        "Here is the second paragraph with more details.",
        "Finally, this is the third paragraph to conclude the overview.",
      ],
    },
    {
      id: "tab3",
      title: "Features",
      content: ["These are the Features of our service."],
    },
  ];
  return (
    <div className="bg-gray-100">
      {/* CONTACT SECTION */}
      <section className="bg-white">
        <div className=" flex justify-between items-center w-[80%] mx-auto h-[8vh] text-gray-700">
          <p>info@foovante-global.com | +(233) 504-609989</p>
          {/* <div>
            <input type="text" placeholder="Search crevy" />
          </div> */}
        </div>
      </section>

      {/* LOGO SECTION */}
      <section className=" bg-myGreen relative pb-[4%] pt-[1%]">
        <div className=" flex justify-between items-center w-[80%] mx-auto h-[16vh] text-white">
          <div className="w-[200px]">
            <Image
              src={logo}
              alt="this is the logo"
              className="w-full text-white"
            />
          </div>

          <div className="flex items-center bg-gray-50/10 border border-white rounded-full px-4 py-2 shadow-sm w-[250px]">
            <input
              type="text"
              placeholder="Search Telemedics"
              className="grow outline-none bg-transparent text-gray-700 placeholder-white"
            />
            <svg
              aria-label="Search icon"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-6 h-6 text-white bg-orange-400 p-1 rounded-full"
            >
              <title id="searchIconTitle">Search icon</title>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z"
              />
            </svg>
          </div>
        </div>
      </section>

      {/* NAVIGATION SECTION */}
      <section className="h-[10vh] w-[80%] translate-x-[15%] absolute bg-white rounded-lg translate-y-[-50%] z-30">
        <nav className=" h-[10vh] w-[50%] mx-auto flex justify-center items-center">
          <ul className="w-[50%] flex justify-between items-center uppercase text-xl">
            <li className=" text-gray-600 hover:text-myGreen  cursor-pointer">
              Home
            </li>
            <li className=" text-gray-600 hover:text-myGreen  cursor-pointer">
              Crevy
            </li>
            <li className=" text-gray-600 hover:text-myGreen  cursor-pointer">
              Support
            </li>
          </ul>
        </nav>
      </section>

      {/* HEADER SECTION */}
      <header className=" bg-[url('/img/img/background.jpg')] h-[95vh] pt-[2%] bg-no-repeat bg-cover bg-center text-white bg-black/40 bg-blend-multiply">
        <div className=" w-[60%] pt-[8%] pl-[8%]">
          <h1 className=" text-6xl font-semibold tracking-wide pb-[40px]">
            <span className="text-6xl font-bold ">Carbon </span>
            Credit <br /> Generation Platform
          </h1>
          <p className=" text-left w-[70%] text-2xl">
            Use our interactive calculator to learn <br /> your carbon credits
            potential and <br /> actions to take to tokenize it.
          </p>
          <div className="flex gap-[5%] w-[70%] pt-[50px]">
            <button
              type="button"
              className=" text-white hover:text-white font-semibold uppercase px-[60px] py-[10px] bg-myGreen rounded-full cursor-pointer hover:bg-myDarkGreen duration-200"
            >
              Sign up
            </button>
            <button
              type="button"
              className=" text-myGreen font-semibold hover:text-white uppercase px-[60px] py-[10px] bg-white border-2 border-white rounded-full cursor-pointer hover:bg-myDarkGreen duration-200"
            >
              Login
            </button>
          </div>
        </div>
      </header>

      {/* CATEGORY SECTION */}
      <section className=" translate-y-[-10%] z-50">
        <div className="w-[90%] mx-auto">
          <div className="flex gap-4">
            <div className="flex-1 group bg-white hover:bg-myGreen p-6 text-gray-600 shadow-2xl duration-300 rounded-lg">
              <div>
                <Image
                  src={flower}
                  alt="this is a flower"
                  className="group-hover:scale-105 transition duration-300"
                />
              </div>
              <h3 className="font-semibold pt-[20px] group-hover:text-white transition duration-300">
                Calculate your Carbon Credits
              </h3>
              <div className="bg-myGreen h-[3px] w-[40%] my-[20px] transition duration-300 group-hover:bg-white"></div>
              <p className="group-hover:text-white transition duration-300">
                Discuss the science, impacts, and solutions related to climate
                change, including global warming, extreme weather events, and
                the transition to renewable energy sources.
              </p>
            </div>

            <div className=" flex-1 group bg-white hover:bg-myGreen p-6 text-gray-600 shadow-2xl duration-300 rounded-lg">
              <div>
                <Image
                  src={bulb}
                  alt="this is a flower"
                  className="group-hover:scale-105 transition duration-300"
                />
              </div>
              <h3 className="font-semibold pt-[20px] group-hover:text-white transition duration-300">
                Sell the Carbon Credits
              </h3>
              <div className="bg-myGreen h-[3px] w-[40%] my-[20px] transition duration-300 group-hover:bg-white"></div>
              <p className="group-hover:text-white transition duration-300">
                Provide tips and information on sustainable practices in areas
                such as energy conservation, extreme weather event waste
                reduction, and eco-friendly lifestyle choices.
              </p>
            </div>

            <div className="flex-1 group bg-white hover:bg-myGreen p-6 text-gray-600 shadow-2xl duration-300 rounded-lg">
              <div>
                <Image
                  src={rotate}
                  alt="this is a flower"
                  className="group-hover:scale-105 transition duration-300"
                />
              </div>
              <h3 className="font-semibold pt-[20px] group-hover:text-white transition duration-300">
                Get Verified & Enlisted
              </h3>
              <div className="bg-myGreen h-[3px] w-[40%] my-[20px] transition duration-300 group-hover:bg-white"></div>
              <p className="group-hover:text-white transition duration-300">
                Provide tips and information on sustainable practices in areas
                such as energy conservation, extreme weather event waste
                reduction, and eco-friendly lifestyle choices.
              </p>
            </div>

            <div className=" flex-1 group bg-white hover:bg-myGreen p-6 text-gray-600 shadow-2xl duration-300 rounded-lg">
              <div>
                <Image
                  src={book}
                  alt="this is a flower"
                  className="group-hover:scale-105 transition duration-300"
                />
              </div>
              <h3 className="font-semibold pt-[20px] group-hover:text-white transition duration-300">
                Earn Your Money
              </h3>
              <div className="bg-myGreen h-[3px] w-[40%] my-[20px] transition duration-300 group-hover:bg-white"></div>
              <p className="group-hover:text-white transition duration-300">
                You get to have a reliable and sustainable source of income by
                selling your carbon credits to our trusted partners
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className=" bg-gray-100 pt-[12%] pb-[10%] mt-[-40px]">
        <div className="w-[80%] mx-auto bg-white rounded-br-[100px] rounded-tl-[100px] ">
          <div className="w-[90%] mx-auto flex">
            <div className="pt-[7%] flex-[1]">
              <div className=" bg-myGreen h-[5px] w-[20%] mr-5"></div>
              <p className="pt-5 text-4xl">
                Use our interactive calculator to learn your carbon credit
                potential and actions to take to tokenize it.
              </p>
              <button
                type="button"
                className=" text-black font-semibold hover:text-white  px-[40px] py-[10px] bg-transparent border-2 border-myGreen rounded-full cursor-pointer  hover:bg-myGreen duration-200 mt-[10%]"
              >
                LAUNCH DEMO
              </button>
            </div>
            <div className="flex-[1]">
              <div className="w-[110%]">
                <Image className="w-full" src={bigimg} alt="" />
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="bg-myGreen py-[8%]">
        <div className="w-[70%] mx-auto font-semibold text-white">
          <h1 className="text-5xl text-center w-[70%] mx-auto">
            Ready to Turn Your Climate Impact Into Revenue?
          </h1>
          <p className="pt-7 text-center w-[85%] mx-auto">
            Join 200+ African climate projects already earning from carbon
            credits. Start your certification journey today and unlock new
            revenue streams for your environmental work.
          </p>
          <div className="pt-[6%] flex justify-center gap-[6%]">
            <button
              type="button"
              className=" text-myGreen hover:text-white  px-[40px] py-[10px] bg-white border-2 border-myGreen rounded-full cursor-pointer  hover:bg-myGreen duration-200"
            >
              Get Started
            </button>

            <button
              type="button"
              className=" text-white hover:bg-white  px-[40px] py-[10px] bg-transparent border-2 border-white rounded-full cursor-pointer  hover:text-myGreen duration-200"
            >
              Watch demo &rarr;
            </button>
          </div>
        </div>
      </section>
      <footer className="bg-myBlue pt-[8%] pb-[5%]">
        <div className="w-[80%] mx-auto flex gap-5">
          <div className="flex-[1]">
            <h1 className="text-4xl font-semibold text-white">Crevy</h1>
            <p className="text-gray-400">by Foovante Global</p>
            <p className="text-white">
              At Foovante, we are committed to providing innovative,
              user-friendly features that make sustainability accessible to
              businesses of all sizes.
            </p>
          </div>

          <div className="flex-[1]">
            <h1 className="text-4xl font-semibold text-white">Contact</h1>
            <p className="text-white pt-5">
              Address:Accra, Greater Accra, Ghana
            </p>
            <p className="text-white pt-5">Phone:+ (233) 504-609989</p>
          </div>

          <div className="flex-[1] text-center">
            <h1 className="text-4xl font-semibold text-white">
              Let’ s Get Social
            </h1>
            <ul className="flex justify-around items-center pt-6 w-[80%] mx-auto">
              <li className="hover:cursor-pointer">
                <Image src={facebook} alt="" />
              </li>
              <li className="hover:cursor-pointer">
                <Image src={twitter} alt="" />
              </li>
              <li className="hover:cursor-pointer">
                <Image src={linkedin} alt="" />
              </li>
            </ul>
          </div>
        </div>
        <div className="w-[80%] mx-auto pt-9 flex justify-between text-white">
          <p>Copyright © Foovante 2024</p>
          <p className=" flex gap-9">
            <span className="hover:cursor-pointer">Terms & Conditions</span>
            <span className="hover:cursor-pointer">Privacy Policy</span>
          </p>
        </div>
      </footer>
    </div>
  );
}
