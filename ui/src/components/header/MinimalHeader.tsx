import Header from "@/components/header/Header";
import "./MinimalHeader.css";

export function MinimalHeader() {
  return (
    <Header className="minimal-header" showSearch={false} showMenu={false} />
  );
}
