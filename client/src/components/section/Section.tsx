import React from "react";
import style from "./Section.module.scss";

interface Props {
  children: React.ComponentProps<any>;
  title: string;
}

const Section = function ({ children, title = "" }: Props) {
  return (
    <div className={style.section}>
      <h2 className={style.title}>{title.toUpperCase()}</h2>
      {children}
    </div>
  );
};

export default Section;
