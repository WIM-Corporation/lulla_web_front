export const MergeStyles = (styles = []) => {
  if (styles.some((v) => typeof v !== "string"))
    styles = styles.map((v) => String(v));
  return styles.join(" ");
};
