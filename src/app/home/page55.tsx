"use client";

import Image from "next/image";
// import "./App.css";
import { useState } from "react";
import arrowup from "../../../public/img/arrow-up.png";
import bigimg from "../../../public/img/big-img.png";
import bike from "../../../public/img/bike.png";
import book from "../../../public/img/book.png";
import bulb from "../../../public/img/bulb.png";
import dashimg from "../../../public/img/dash-img.png";
import facebook from "../../../public/img/facebook.png";
import flower from "../../../public/img/flower.png";
import lineleft from "../../../public/img/line-left.png";
import lineright from "../../../public/img/line-right.png";
import link from "../../../public/img/link1.png";
import linkedin from "../../../public/img/linkedin.png";
import mac from "../../../public/img/mac.png";
import man from "../../../public/img/man1.png";
import people from "../../../public/img/people.png";
import rotate from "../../../public/img/rotate.png";
import stack from "../../../public/img/stack.png";
import twitter from "../../../public/img/twitter.png";
import upload from "../../../public/img/upload.png";
import user from "../../../public/img/user.png";
import verify from "../../../public/img/verify.png";
import windowimg from "../../../public/img/window.png";

export default function HomePage() {
  const [activeTab, setActiveTab] = useState("tab1");

  const tabs = [
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
    <div>
      <section className=" bg-myGreen">
        <div className=" flex justify-between items-center w-[80%] mx-auto h-[8vh] text-white">
          <p>info@foovante-global.com | +(233) 504-609989</p>
          {/* <div>
            <input type="text" placeholder="Search crevy" />
          </div> */}
          <div className="flex items-center bg-gray-50/30 border border-white rounded-full px-4 py-2 shadow-sm w-[250px]">
            <input
              type="text"
              placeholder="Search crevy"
              className="flex-grow outline-none bg-transparent text-gray-700 placeholder-gray-500"
            />
            <svg
              aria-label="Search icon"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5 text-white bg-myDarkGreen p-1 rounded-full"
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
      <section className=" bg-white">
        <div className=" flex justify-between items-center w-[80%] mx-auto h-[12vh] text-white">
          <p className=" text-myGreen text-5xl">Crevy</p>
          <nav>
            <ul className=" flex justify-between items-center gap-[30px]">
              <li className=" text-black hover:text-myGreen  cursor-pointer">
                Home
              </li>
              <li className=" text-black hover:text-myGreen  cursor-pointer">
                Features
              </li>
              <li className=" text-black hover:text-myGreen  cursor-pointer">
                How it Works
              </li>
              <li className=" text-white hover:text-white ml-[40px] px-[40px] py-[10px] bg-myGreen rounded-full  cursor-pointer  hover:bg-myDarkGreen duration-200">
                Get Started
              </li>
            </ul>
          </nav>
        </div>
      </section>
      <header className=" bg-[url('/img/moon.webp')] h-[80vh] bg-no-repeat bg-cover bg-center text-white">
        <div className=" w-[60%] pt-[6%] pl-[8%]">
          <h2 className=" text-lg font-semibold pb-[20px]">
            GROW. TRADE. LIVE
          </h2>
          <h1 className=" text-5xl font-bold tracking-wider pb-[20px]">
            Turn Your Climate Impact Into Carbon Credits
          </h1>
          <p className=" text-left w-[70%]">
            Crevy helps African climate projects calculate carbon savings, get
            internationally certified, and earn revenue through verified carbon
            credits. From clean cookstoves to reforestation - we make carbon
            certification simple
          </p>
          <div className="flex gap-[5%] w-[70%] pt-[40px]">
            <button
              type="button"
              className=" text-white hover:text-white   px-[40px] py-[10px] bg-myGreen rounded-full cursor-pointer hover:bg-myDarkGreen duration-200"
            >
              Start your project
            </button>
            <button
              type="button"
              className=" text-white hover:text-white  px-[40px] py-[10px] bg-transparent border-2 border-white rounded-full cursor-pointer  hover:bg-myDarkGreen duration-200"
            >
              Watch demo &rarr;
            </button>
          </div>
        </div>
      </header>
      <section className=" bg-gray-100">
        <div className="w-[85%] mx-auto">
          <div className="pb-[8%]">
            <h1 className=" text-4xl font-semibold text-gray-800 pt-[12%] pb-[0px] flex items-center">
              The Problem Today
              <div className=" bg-myGreen h-[3px] w-[20%] ml-5"></div>
            </h1>
            <p className=" text-gray-700">
              A broken connection between those creating climate impact — and
              those willing to pay for it.
            </p>
          </div>
          <div className="flex gap-6">
            <div className=" flex gap-0">
              <div className="flex-[30%]">
                <Image src={man} alt="a man holding a card" />
              </div>
              <div className="flex-[70%]">
                <h1 className=" font-medium text-xl">Project owners</h1>
                <p>
                  You’ve poured your soul into the soil. You’ve planted,
                  protected, and restored what others overlooked. But the next
                  step, getting support for your impact, still feels out of
                  reach.
                </p>
              </div>
            </div>
            <div className=" flex gap-0">
              <div className="flex-[20%]">
                <Image src={man} alt="a man holding a card" />
              </div>
              <div className="flex-[60%]">
                <h1 className=" font-medium text-xl">Project owners</h1>
                <p>
                  You want to be part of the solution. To give back to the
                  planet in ways that matter. But finding real, grounded climate
                  action? It’s tough. Scattered. Full of big claims, but little
                  proof.
                </p>
              </div>
            </div>
          </div>
          <div className=" flex justify-center items-center pt-[10px]">
            <Image
              className=" translate-x-[-150%] translate-y-[40%]"
              src={lineleft}
              alt="this is a link symbol"
            />
            <Image src={link} alt="this is a link symbol" />
            <Image
              className=" translate-x-[150%] translate-y-[40%]"
              src={lineright}
              alt="this is a link symbol"
            />
          </div>
          <div className="pb-[10%]">
            <h1 className=" text-4xl text-gray-800 pb-[0px] text-center">
              Two sides, One missing link!
            </h1>
            <p className="text-gray-700 text-center">
              That’s where <span className=" text-myGreen">Crevy </span>
              comes in.
            </p>
          </div>
        </div>
      </section>
      <section>
        <div className="flex gap-5 w-[85%] mx-auto pt-[8%]">
          <div className="flex-1">
            <h1 className="text-4xl text-gray-800">
              The Solution, <span className="text-myGreen">Crevy</span>
            </h1>
            <p className="text-gray-700 pt-3">
              Everything you need to finish your climate project — all in one
              platform.
            </p>
            <div className="pt-9 translate-x-[-9%]">
              <Image
                className="w-[100%]"
                src={mac}
                alt="this is a mac symbol"
              />
            </div>
          </div>
          <div className="flex-1">
            {/* Tab Headers */}
            <div className="flex justify-around  bg-gray-100 rounded-full">
              {tabs.map((tab) => (
                <button
                  type="button"
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-3 px-9 text-sm font-semibold border-b-2 transition duration-200 ${
                    activeTab === tab.id
                      ? "border-myGreen text-white bg-myGreen rounded-full"
                      : "border-transparent text-gray-700 hover:text-myGreen"
                  }`}
                >
                  {tab.title}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            {/* <div className="p-6 text-gray-700 text-xl">
              {tabs.map((tab) =>
                activeTab === tab.id ? (
                  <div key={tab.id}>
                    <p>{tab.content}</p>
                  </div>
                ) : null
              )}
            </div> */}
            <div className="p-6 text-gray-700 text-xl">
              {tabs.map((tab) =>
                activeTab === tab.id ? (
                  <div key={tab.id}>
                    {tab.content.map((para) => (
                      <p key={para} className="mt-[6%]">
                        {para}
                      </p>
                    ))}
                  </div>
                ) : null,
              )}
            </div>
          </div>
        </div>
      </section>
      <section>
        <div className="w-[90%] mx-auto">
          <div className="pb-[4%] ">
            <h1 className=" text-4xl font-semibold text-gray-800 pt-[12%] flex justify-center items-center">
              <div className=" bg-myGreen h-[3px] w-[10%] mr-5"></div>
              How Crevy Works
              <div className=" bg-myGreen h-[3px] w-[10%] ml-5"></div>
            </h1>
            <p className=" text-gray-700 text-center pt-3">
              Let’s tell you how the solution works!
            </p>
          </div>

          <div className="flex gap-4">
            <div className="group hover:bg-myGreen p-6 text-gray-600 shadow-2xl duration-300 rounded-lg">
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

            <div className="group hover:bg-myGreen p-6 text-gray-600 shadow-2xl duration-300 rounded-lg">
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

            <div className="group hover:bg-myGreen p-6 text-gray-600 shadow-2xl duration-300 rounded-lg">
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

            <div className="group hover:bg-myGreen p-6 text-gray-600 shadow-2xl duration-300 rounded-lg">
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
          <div className="my-[6%] flex justify-center items-center">
            <button
              type="button"
              className=" text-white hover:text-white  px-[40px] py-[10px] bg-myGreen rounded-full cursor-pointer hover:bg-myDarkGreen duration-200 "
            >
              Start your project
            </button>
          </div>
        </div>
      </section>
      <section className=" bg-gray-100">
        <div className=" w-[80%] mx-auto pb-[7%]">
          <div className="pb-[4%] ">
            <h1 className=" text-4xl font-semibold text-gray-800 pt-[12%] flex justify-center items-center">
              <div className=" bg-myGreen h-[3px] w-[10%] mr-5"></div>
              Who is Crevy for?
              <div className=" bg-myGreen h-[3px] w-[10%] ml-5"></div>
            </h1>
            <p className=" text-gray-700 text-center pt-3">
              Let’s tell you how the solution works!
            </p>
          </div>

          <div className="flex justify-between">
            <Image
              className=" translate-x-[80%] translate-y-[30%]"
              src={arrowup}
              alt="arrow facing up"
            />
            <Image
              className=" translate-x-[-80%] translate-y-[30%]"
              src={arrowup}
              alt="arrow facing up"
            />
          </div>
          <div className="flex justify-center gap-7">
            <div className=" p-6 shadow-2xl hover:border-b-6 hover:border-b-myGreen duration-200 flex-[1] bg-white">
              <div className="flex justify-center items-center">
                <Image src={bike} alt="this is a flower" />
              </div>
              <h3 className=" font-semibold pt-[20px] text-center">
                Farmers & Cooperatives
              </h3>
              <p className=" text-gray-600 text-center">
                Land restoration, agroforestry, sustainable agriculture — all
                counted.
              </p>
              <div className="my-[6%] flex justify-center items-center">
                <button
                  type="button"
                  className=" text-myGreen hover:text-white  px-[40px] py-[8px] bg-transparent border-2 border-myGreen rounded-lg cursor-pointer  hover:bg-myGreen duration-200"
                >
                  Learn more
                </button>
              </div>
            </div>

            <div className=" p-6 shadow-2xl hover:border-b-6 hover:border-b-myGreen duration-200 flex-[1] bg-white">
              <div className="flex justify-center items-center">
                <Image src={people} alt="this is a flower" />
              </div>
              <h3 className=" font-semibold pt-[20px] text-center">
                Community Projects
              </h3>
              <p className=" text-gray-600 text-center">
                Clean cooking, waste management, reforestation groups.
              </p>
              <div className="my-[6%] flex justify-center items-center">
                <button
                  type="button"
                  className=" text-myGreen hover:text-white  px-[40px] py-[8px] bg-transparent border-2 border-myGreen rounded-lg cursor-pointer  hover:bg-myGreen duration-200"
                >
                  Learn more
                </button>
              </div>
            </div>

            <div className=" p-6 shadow-2xl hover:border-b-6 hover:border-b-myGreen duration-200 flex-[1] bg-white">
              <div className="flex justify-center items-center">
                <Image src={stack} alt="this is a flower" />
              </div>
              <h3 className=" font-semibold pt-[20px] text-center">
                Green Startups
              </h3>
              <p className=" text-gray-600 text-center">
                Solar, biochar, composting, and more.
              </p>
              <div className="my-[6%] flex justify-center items-center">
                <button
                  type="button"
                  className=" text-myGreen hover:text-white  px-[40px] py-[8px] bg-transparent border-2 border-myGreen rounded-lg cursor-pointer  hover:bg-myGreen duration-200"
                >
                  Learn more
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section>
        <div className="pb-[4%]">
          <div className="pb-[4%] ">
            <h1 className=" text-4xl font-semibold text-gray-800 pt-[12%] flex justify-center items-center">
              <div className=" bg-myGreen h-[3px] w-[10%] mr-5"></div>A peek on
              what to expect
              <div className=" bg-myGreen h-[3px] w-[10%] ml-5"></div>
            </h1>
            <p className=" text-xl text-gray-700 text-center pt-3">
              Everything you need to transform your climate project into
              verified carbon credits
            </p>
          </div>
          <div className="flex gap-8 w-[90%] mx-auto">
            <div className="flex-[1]">
              <p className=" text-gray-700 pt-3">
                Tempus nunc risus a urna commodo in suspendisse cursus etiam.
                Tellus non quisque semper tellus. Feugiat nam nibh nibh quis
                scelerisque sapien. Ipsum odio porttitor ac cras mi est. Non
                amet at nibh erat nunc id sed. Tortor penatibus urna id feugiat
                varius nisi id aliquet morbi. Cras commodo morbi aliquet lacinia
                nisl amet imperdiet natoque nunc.
              </p>
              <div className="pt-[30px]">
                <Image src={dashimg} alt="" />
              </div>
            </div>
            <div className="flex-[1]">
              <div className="group hover:border-r-8 hover:border-r-myGreen hover:shadow-2xl py-5 px-5 hover:rounded-b-lg flex gap-4 duration-200 mb-2">
                <div className="bg-gray-300 group-hover:bg-myGreen h-fit p-2 rounded-lg duration-200">
                  <Image src={upload} alt="upload icon" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold">Carbon Calculator</h1>
                  <p className="text-gray-600 group-hover:text-gray-800 transition duration-200">
                    Advanced tools to accurately measure and quantify your
                    project's carbon impact
                  </p>
                </div>
              </div>

              <div className="group hover:border-r-8 hover:border-r-myGreen hover:shadow-2xl py-5 px-5 hover:rounded-b-lg flex gap-4 duration-200 mb-2">
                <div className="bg-gray-300 group-hover:bg-myGreen h-fit p-2 rounded-lg duration-200">
                  <Image src={verify} alt="upload icon" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold">Progress Tracker</h1>
                  <p className="text-gray-600 group-hover:text-gray-800 pr-2 transition duration-200">
                    Real-time monitoring of your certification journey and
                    carbon credit generation
                  </p>
                </div>
              </div>

              <div className="group hover:border-r-8 hover:border-r-myGreen hover:shadow-2xl py-5 px-5 hover:rounded-b-lg flex gap-4 duration-200 mb-2">
                <div className="bg-gray-300 group-hover:bg-myGreen h-fit p-2 rounded-lg duration-200">
                  <Image src={windowimg} alt="upload icon" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold">Certification Guide</h1>
                  <p className="text-gray-600 group-hover:text-gray-800 transition duration-200">
                    Step-by-step guidance through Verra, Gold Standard, and
                    other certification processes
                  </p>
                </div>
              </div>

              <div className="group hover:border-r-8 hover:border-r-myGreen hover:shadow-2xl py-5 px-5 hover:rounded-b-lg flex gap-4 duration-200 mb-2">
                <div className="bg-gray-300 group-hover:bg-myGreen h-fit p-2 rounded-lg duration-200">
                  <Image src={user} alt="upload icon" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold">Market Connect</h1>
                  <p className="text-gray-600 group-hover:text-gray-800 transition duration-200">
                    Direct connection to verified carbon credit buyers and
                    marketplace opportunities
                  </p>
                </div>
              </div>

              <div>
                <button
                  type="button"
                  className=" text-white hover:text-white  px-[40px] py-[10px] ml-4 mt-4 bg-myGreen rounded-lg cursor-pointer hover:bg-myDarkGreen duration-200"
                >
                  Get Started
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className=" bg-gray-100 pt-[8%] pb-[10%]">
        <div className="w-[80%] mx-auto bg-white rounded-br-[100px] rounded-tl-[100px] ">
          <div className="w-[90%] mx-auto flex">
            <div className="pt-[7%] flex-[1]">
              <div className=" bg-myGreen h-[5px] w-[20%] mr-5"></div>
              <p className="pt-5 text-2xl">
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
