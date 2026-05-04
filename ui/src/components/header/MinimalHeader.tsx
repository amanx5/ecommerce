import Header from "@/components/header/Header";

export function MinimalHeader() {
  return (
    <Header 
      className="bg-white! [&_a]:text-(--header-bg)!" 
      showSearch={false} 
      showMenu={false} 
    />
  );
}
