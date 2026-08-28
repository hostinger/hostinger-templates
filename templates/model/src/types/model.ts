export type Category = "Billing" | "Account access" | "Bug report" | "Product question";
export type Urgency = "Critical" | "High" | "Normal";

export interface Classification {
  category: Category;
  urgency: Urgency;
  confidence: number;
  signals: string[];
  nextAction: string;
  responseDraft: string;
}

export interface ExampleTicket {
  label: string;
  text: string;
}
