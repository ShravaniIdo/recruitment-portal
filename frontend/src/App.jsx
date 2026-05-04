// import { useContext } from "react";
// import { FormContext } from "./context/FormContext";

// // Components Imports
// import Navbar from "./components/common/Navbar";
// import Stepper from "./components/common/Stepper";
// import PrimaryInfoForm from "./components/registration/PrimaryInfoForm";
// import PersonalDetailsForm from "./components/registration/PersonalDetailsForm";
// import EducationDetailsForm from "./components/registration/EducationDetailsForm";
// import LandingPage from "./pages/LandingPage";
// import TestPage from "./pages/test/TestPage";
// import ResultPage from "./pages/result/ResultPage";

// const MainApp = () => {
//   const { formData } = useContext(FormContext);

//   const renderStep = () => {
//     switch (formData.step) {
//       case 1: return <PrimaryInfoForm />;
//       case 2: return <PersonalDetailsForm />;
//       case 3: return <EducationDetailsForm />;
//       case 4: return <LandingPage />;
//       case 5: return <TestPage />;
//       case 6: return <ResultPage />;
//       default: return <PrimaryInfoForm />;
//     }
//   };

//   // 💡 Logic: Hide the stepper during the actual exam (Step 5) and results (Step 6)
//   const showStepper = formData.step < 4;

//   return (
//     <div className="portal">
//       <Navbar />
      
//       <main className="main">

//         {showStepper && (
//           <div style={{ 
//             display: "flex", 
//             justifyContent: "center", 
//             width: "100%", 
//             marginBottom: "2rem" 
//           }}>
//             <div style={{ width: "100%", maxWidth: "600px" }}>
//               <Stepper currentStep={formData.step} />
//             </div>
//           </div>
//         )}

//         {/*   Form Content Area */}
//         <div className="content-area">
//           {renderStep()}
//         </div>
//       </main>
//     </div>
//   );
// };

// export default MainApp;











import { useContext } from "react";
import { FormContext } from "./context/FormContext";
 
// Components Imports
import Navbar from "./components/common/Navbar";
import Stepper from "./components/common/Stepper";
import PrimaryInfoForm from "./components/registration/PrimaryInfoForm";
import PersonalDetailsForm from "./components/registration/PersonalDetailsForm";
import EducationDetailsForm from "./components/registration/EducationDetailsForm";
import LandingPage from "./pages/LandingPage";
import TestPage from "./pages/test/TestPage";
import ResultPage from "./pages/result/ResultPage";
 
const MainApp = () => {
  const { formData } = useContext(FormContext);
 
  const renderStep = () => {
    switch (formData.step) {
      case 1: return <PrimaryInfoForm />;
      case 2: return <PersonalDetailsForm />;
      case 3: return <EducationDetailsForm />;
      case 4: return <LandingPage />;
      case 5: return <TestPage />;
      case 6: return <ResultPage />;
      default: return <PrimaryInfoForm />;
    }
  };
 
  // 💡 Logic: Hide the stepper during the actual exam (Step 5) and results (Step 6)
  const showStepper = formData.step < 4;
 
  // Steps 5 (Test) and 6 (Result) get full-width layout — no 860px constraint
  const isFullWidth = formData.step === 5 || formData.step === 6;
 
  return (
    <div className="portal">
      <Navbar />
 
      {isFullWidth ? (
        <div style={{ flex: 1, width: "100%" }}>
          {renderStep()}
        </div>
      ) : (
      <main className="main">
 
        {showStepper && (
          <div style={{ 
            display: "flex", 
            justifyContent: "center", 
            width: "100%", 
            marginBottom: "2rem" 
          }}>
            <div style={{ width: "100%", maxWidth: "600px" }}>
              <Stepper currentStep={formData.step} />
            </div>
          </div>
        )}
 
        {/*   Form Content Area */}
        <div className="content-area">
          {renderStep()}
        </div>
      </main>
      )}
    </div>
  );
};
 
export default MainApp;
 
 