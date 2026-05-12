import { Link } from "react-router";
import Logo from "./Logo";
import { FaFacebook, FaYoutube,  } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

const Footer = () => {
  return (
    <footer className="bg-base-300 ">
      <div className="footer sm:footer-horizontal  text-base-content px-3 py-10 max-w-350 mx-auto">
        <div>
          <Logo />
          <p className="text-3xl text-secondary">Digital Life Lessons</p>
          <p className="text-lg text-accent">
            "Preserving Wisdom, Empowering Growth."
          </p>
        </div>
        <nav>
          <h6 className="footer-title">Contact Info</h6>
          <p>Email: digital.life@lessons.com</p>
          <p>Phone: 01812345678</p>
          <p>Address: 14/3, Senpara Parbata, Mirpur-10,</p>
          <Link className="link link-hover">Terms & Conditions</Link>
          
        </nav>
        <nav>
          <h6 className="footer-title">Social</h6>
          <div className="grid grid-flow-col gap-4">
            <Link>
              <FaFacebook size={25}/>
            </Link>
            <Link>
              <FaXTwitter size={25}/>
            </Link>
            <Link>
              <FaYoutube size={25}/>
            </Link>
           
          </div>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;
