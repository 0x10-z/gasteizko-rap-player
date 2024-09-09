export type Theme = {
  text: string;
  backgroundImage: string;
  backgroundColor: string;
  backgroundSize: string;
  color: string;
};

export const lightTheme: Theme = {
  text: "#000000",
  backgroundImage: `linear-gradient(to right, #f5f5f5, transparent 1px), linear-gradient(to bottom, #f5f5f5, transparent 1px)`,
  backgroundColor: "#fff",
  backgroundSize: "100px 100px",
  color: "#000000",
};

export const darkTheme: Theme = {
  text: "#f7f7f7",
  backgroundImage: `linear-gradient(to right, #444444 1px, transparent 1px), 
                    linear-gradient(to bottom, #444444 1px, transparent 1px)`,
  backgroundColor: "#000000",
  backgroundSize: "100px 100px",
  color: "#ffffff",
};
