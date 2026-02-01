"use client";

import { benefits } from "@/app/utils/listofBenefits";
import { Badge } from "@/components/ui/badge";

/** Minimal field shape so any react-hook-form ControllerRenderProps is accepted */
interface BenefitsSelectorField {
  value: string[];
  onChange: (value: string[]) => void;
  onBlur: () => void;
  name: string;
}

interface BenefitsSelectorProps {
  field: BenefitsSelectorField;
}

export default function BenefitsSelector({ field }: BenefitsSelectorProps) {
  const toggleBenefit = (benefitId: string) => {
    const currentBenefits = field.value || [];
    const newBenefits = currentBenefits.includes(benefitId)
      ? currentBenefits.filter((id: string) => id !== benefitId)
      : [...currentBenefits, benefitId];

    field.onChange(newBenefits);
  };

  return (
    <div className="">
      <div className="flex flex-wrap gap-3">
        {benefits.map((benefit) => {
          const isSelected = (field.value || []).includes(benefit.id);
          const IconComponent = benefit.icon;
          return (
            <Badge
              key={benefit.id}
              variant={isSelected ? "default" : "outline"}
              className="cursor-pointer transition-all hover:scale-105 active:scale-95 select-none text-sm px-4 py-1.5 rounded-full"
              onClick={() => toggleBenefit(benefit.id)}
            >
              <span className="flex items-center gap-2">
                <IconComponent className="w-3 h-3" />
                {benefit.label}
              </span>
            </Badge>
          );
        })}
      </div>
      <div className="mt-4 text-sm text-muted-foreground">
        Selected benefits:{" "}
        <span className="text-primary">{(field.value || []).length}</span>
      </div>
    </div>
  );
}
