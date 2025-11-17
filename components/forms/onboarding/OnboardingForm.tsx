"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Briefcase } from "lucide-react";
import { useState } from "react";
import UserTypeSelection from "./UserTypeSelection";

type UserType = "company" | "jobSeeker" | null;

export default function OnboardingForm() {
  const [step, setStep] = useState(1);
  const [userType, setUserType] = useState<UserType>(null);

  const handleUserTypeSelect = (type: UserType) => {
    setUserType(type);
    setStep(2);
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return <UserTypeSelection onSelect={handleUserTypeSelect} />;
      case 2:
        return userType === "company"
          ? "User is an company"
          : "User is a job seeker";
      default:
        return null;
    }
  };

  return (
    <>
      <div className="flex gap-3 justify-center items-center mb-5">
        <Briefcase className="text-primary w-10 h-10" />
        <h1 className="text-primary text-2xl font-bold">JobsFinder</h1>
      </div>
      <Card className="w-full max-w-lg">
        <CardContent className="p-6">{renderStep()}</CardContent>
      </Card>
    </>
  );
}
