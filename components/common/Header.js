import Link from "next/dist/client/link";
import Image from "next/dist/client/image";
import Logo from "@/assets/imgs/logo.png";

export default function Header({ children }) {
  return (
    <>
      <header id="header">
        <div className="main_hd">
          <Link href="/">
            <a>
              <Image src={Logo} alt="logo" />
            </a>
          </Link>
          {children}
        </div>
      </header>
      <style jsx>{`
        header {
          position: fixed;
        }
      `}</style>
    </>
  );
}
