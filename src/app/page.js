'use client';

import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle2, ChevronRight, Lightbulb, Copy, FileText, Video, Megaphone, RefreshCw, ArrowLeft } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '../components/ui/alert';

const steps = [
  { name: "아이템 제안", icon: Lightbulb },
  { name: "아이템 선택", icon: CheckCircle2 },
  { name: "카피라이팅", icon: Copy },
  { name: "상세페이지", icon: FileText },
  { name: "웨비나 대본", icon: Video },
  { name: "웨비나 홍보 카피", icon: Megaphone }
];

const tips = {
  0: "주제, 타겟, 최상의 결과를 구체적으로 작성할수록 더 좋은 아이디어가 생성됩니다.",
  1: "가장 흥미롭고 실현 가능성이 높은 아이디어를 선택하세요.",
  2: "고객의 관심을 끌 수 있는 짧고 강력한 문구를 선택하세요.",
  3: "상세 페이지는 고객이 제품/서비스의 가치를 이해하는 데 중요합니다.",
  4: "웨비나 대본은 청중과 상호작용할 수 있는 부분을 포함하면 좋습니다.",
  5: "홍보 카피는 웨비나의 핵심 가치를 간결하게 전달해야 합니다."
};

const BusinessIdeaGenerator = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [generatedItems, setGeneratedItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState('');
  const [copywritings, setCopywritings] = useState([]);
  const [selectedCopy, setSelectedCopy] = useState('');
  const [detailPage, setDetailPage] = useState('');
  const [webinarScript, setWebinarScript] = useState('');
  const [promotionCopies, setPromotionCopies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [topic, setTopic] = useState('');
  const [target, setTarget] = useState('');
  const [bestResult, setBestResult] = useState('');
  const [isPreviousButtonClicked, setIsPreviousButtonClicked] = useState(false);
  useEffect(() => {
    console.log("Current step:", currentStep);
    console.log("Generated items:", generatedItems);
    console.log("Selected item:", selectedItem);
    // 여기에 currentStep에 따른 추가 로직이 있다면 제거하거나 수정해야 합니다.
  }, [currentStep, generatedItems, selectedItem]);

  const generateItems = async (topic, target, bestResult) => {
    console.log("Generating items with:", { topic, target, bestResult });
    const prompt = `당신은 사람들이 제시한 주제를 바탕으로 실제로 추진 가능한 사업 아이템을 제안하는 역할을 맡게 될 것입니다. 제가 주제를 제시하면, 그것을 바탕으로 3개의 현실적이고 실행 가능한 사업 아이디어를 생성해주세요.
    주제는 다음과 같습니다: <주제> ${topic} </주제>
    타겟은 다음과 같습니다: <타겟> ${target} </타겟>
    그들이 원하는 최상의 결과는 다음과 같습니다: <최상의 결과> ${bestResult} </최상의 결과>
    이 주제와 타겟, 그들이 원하는 최상의 결과를 신중히 고려하여, 누군가 실제로 추진할 수 있는 실용적이고 실행 가능한 사업 아이디어 3가지를 제안해주세요. 각 아이디어는 다음과 같은 고정된 형식으로 제시되어야 합니다: 다른 말 없이 이 형식대로만 보내주세요.
    <사업아이템1>사업아이템 내용 입력</사업아이템1> <간략한소개1>간략한 소개 내용 입력</간략한소개1>
    <사업아이템2>사업아이템 내용 입력</사업아이템2> <간략한소개2>간략한 소개 내용 입력</간략한소개2>
    <사업아이템3>사업아이템 내용 입력</사업아이템3> <간략한소개3>간략한 소개 내용 입력</간략한소개3>
    한국어로 작성하고, 주제를 창의적으로 해석하되, 실제로 현실에서 해볼 수 있는 사업 아이템을 제안해주세요. 목표는 구체화된 사업 계획이 아니라 실행 가능한 비즈니스를 도출하는 것입니다.
    각 아이디어의 핵심을 단 몇 문장으로 파악하는 데 집중하세요. 전후에 추가 설명 없이 비즈니스 아이디어를 즉시 제공하세요. 포괄적이고 뜬구름 잡는 내용이 아닌, 즉시 실현 가능한 아이디어야 합니다.`;

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      const data = await response.json();
      console.log("API Response:", data);

      const items = [];
      const regex = /<사업아이템(\d)>(.*?)<\/사업아이템\1>\s*<간략한소개\1>(.*?)<\/간략한소개\1>/g;
      let match;
      while ((match = regex.exec(data.result)) !== null) {
        items.push({ item: match[2], description: match[3] });
      }
      console.log("Parsed Items:", items);
      return items;
    } catch (error) {
      console.error("Error generating items:", error);
      return [];
    }
  };

  const generateCopywritings = async (item) => {
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: `Create 3 catchy and creative copywriting phrases for the business idea: ${item}. 
                 Each phrase should be short, memorable, and appeal to potential customers. 
                 Format the response as a numbered list.`
      }),
    });
    const data = await response.json();
    return data.result.split('\n').filter(copy => copy.trim() !== '');
  };

  const generateDetailPage = async (item, copy) => {
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: `Create a detailed product page content for the business idea: "${item}" 
                 using the copywriting phrase: "${copy}". 
                 Include sections for:
                 1. Product Description
                 2. Key Features
                 3. Benefits
                 4. How It Works
                 5. Pricing
                 Format the response with appropriate headings and bullet points.`
      }),
    });
    const data = await response.json();
    return data.result;
  };

  const generateWebinarScript = async (item, copy) => {
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: `Create a webinar script outline for the business idea: "${item}" 
                 using the copywriting phrase: "${copy}". 
                 The outline should include:
                 1. Introduction
                 2. Problem Statement
                 3. Solution Presentation
                 4. Key Features and Benefits
                 5. Demonstration
                 6. Q&A Session
                 7. Call to Action
                 Provide brief descriptions for each section.`
      }),
    });
    const data = await response.json();
    return data.result;
  };

  const generatePromotionCopies = async (item, copy, script) => {
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: `Create 5 promotional copies for a webinar about the business idea: "${item}" 
                 using the main copywriting phrase: "${copy}". 
                 Use the following webinar script outline for context:
                 ${script}
                 Each promotional copy should be a short, catchy phrase that entices people to attend the webinar. 
                 Format the response as a numbered list.`
      }),
    });
    const data = await response.json();
    return data.result.split('\n').filter(promo => promo.trim() !== '');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isPreviousButtonClicked) {
      setIsPreviousButtonClicked(false);
      return;
    }

    setIsLoading(true);
    try {
      switch (currentStep) {
        case 0:
          const items = await generateItems(topic, target, bestResult);
          setGeneratedItems(items);
          setCurrentStep(currentStep + 1);
          break;
        case 1:
          if (selectedItem) {
            setCurrentStep(currentStep + 1);
          } else {
            alert("아이템을 선택해주세요.");
          }
          break;
        case 2:
          if (selectedItem) {
            const copies = await generateCopywritings(selectedItem);
            setCopywritings(copies);
            setCurrentStep(currentStep + 1);
          } else {
            alert("아이템을 선택해주세요.");
          }
          break;
        case 3:
          const page = await generateDetailPage(selectedItem, selectedCopy);
          setDetailPage(page);
          setCurrentStep(currentStep + 1);
          break;
        case 4:
          const script = await generateWebinarScript(selectedItem, selectedCopy);
          setWebinarScript(script);
          setCurrentStep(currentStep + 1);
          break;
        case 5:
          const promos = await generatePromotionCopies(selectedItem, selectedCopy, webinarScript);
          setPromotionCopies(promos);
          setCurrentStep(currentStep + 1);
          break;
        default:
          break;
      }
    } catch (error) {
      console.error("Error generating content:", error);
    } finally {
      setIsLoading(false);
    }
  };
  const handleRegenerate = async (step) => {
    setIsLoading(true);
    try {
      switch (step) {
        case 0:
          const items = await generateItems(topic, target, bestResult);
          setGeneratedItems(items);
          break;
        case 2:
          const copies = await generateCopywritings(selectedItem);
          setCopywritings(copies);
          break;
        case 3:
          const page = await generateDetailPage(selectedItem, selectedCopy);
          setDetailPage(page);
          break;
        case 4:
          const script = await generateWebinarScript(selectedItem, selectedCopy);
          setWebinarScript(script);
          break;
        case 5:
          const promos = await generatePromotionCopies(selectedItem, selectedCopy, webinarScript);
          setPromotionCopies(promos);
          break;
      }
    } catch (error) {
      console.error("Error regenerating content:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setIsPreviousButtonClicked(true);
      setCurrentStep(prevStep => prevStep - 1);
    }
  };

  const renderStepContent = () => {
    const commonButtonClasses = "flex items-center px-4 py-2 rounded-full transition duration-300 shadow-md";
    const backButtonClasses = `${commonButtonClasses} bg-gray-100 text-gray-700 hover:bg-gray-200`;
    const regenerateButtonClasses = `${commonButtonClasses} bg-blue-500 text-white hover:bg-blue-600`;

    const renderNavigationButtons = () => (
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={handlePrevious}
          className={backButtonClasses}
        >
          <ArrowLeft size={20} className="mr-2" />
          이전
        </button>
        {currentStep > 0 && (
          <button
            onClick={() => handleRegenerate(currentStep)}
            className={regenerateButtonClasses}
          >
            <RefreshCw size={20} className="mr-2" />
            재생성
          </button>
        )}
      </div>
    );

    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            {renderNavigationButtons()}
            <div className="space-y-4">
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="주제를 입력하세요"
                className="w-full p-4 border-2 border-gray-300 rounded-full focus:ring-4 focus:ring-blue-300 focus:border-blue-500 transition duration-300 ease-in-out text-lg text-gray-700 shadow-sm"
              />
              <input
                type="text"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                placeholder="타겟을 입력하세요"
                className="w-full p-4 border-2 border-gray-300 rounded-full focus:ring-4 focus:ring-blue-300 focus:border-blue-500 transition duration-300 ease-in-out text-lg text-gray-700 shadow-sm"
              />
              <input
                type="text"
                value={bestResult}
                onChange={(e) => setBestResult(e.target.value)}
                placeholder="최상의 결과를 입력하세요"
                className="w-full p-4 border-2 border-gray-300 rounded-full focus:ring-4 focus:ring-blue-300 focus:border-blue-500 transition duration-300 ease-in-out text-lg text-gray-700 shadow-sm"
              />
            </div>
          </div>
        );
        case 1:
          return (
            <div className="space-y-6">
              {renderNavigationButtons()}
              <h3 className="text-2xl font-bold text-gray-800">생성된 아이템:</h3>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {generatedItems.map((item, index) => (
                  <button
                    key={index}
                    
                    onClick={(e) => {
                      e.preventDefault(); // 폼 제출 방지
                      setSelectedItem(item.item);
                    }}
                    className={`p-6 rounded-xl transition duration-300 ease-in-out transform hover:scale-105 ${
                      selectedItem === item.item
                        ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg'
                        : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-blue-300 hover:shadow-xl'
                    }`}
                  >
                    <h4 className="text-lg font-bold mb-2">{item.item}</h4>
                    <p className="text-sm">{item.description}</p>
                  </button>
                ))}
              </div>
              {selectedItem && (
                <div className="mt-6">
                  <h4 className="text-lg font-bold text-gray-800">선택된 아이템:</h4>
                  <p className="text-blue-600">{selectedItem}</p>
                </div>
              )}
            </div>
          );
        
        case 2:
          return (
            <div className="space-y-6">
              {renderNavigationButtons()}
              <h3 className="text-2xl font-bold text-gray-800">선택된 아이템: <span className="text-blue-600">{selectedItem}</span></h3>
              {copywritings.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-gray-800">제안된 카피라이팅:</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {copywritings.map((copy, index) => (
                      <button
                        key={index}
                        onClick={(e) => {
                          e.preventDefault(); // 폼 제출 방지
                          setSelectedCopy(copy);
                        }}
                        className={`p-4 rounded-xl transition duration-300 ease-in-out transform hover:scale-105 ${
                          selectedCopy === copy
                            ? 'bg-gradient-to-r from-green-400 to-blue-500 text-white shadow-lg'
                            : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-green-300 hover:shadow-xl'
                        }`}
                      >
                        {copy}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {selectedCopy && (
                <div className="mt-6">
                  <h4 className="text-lg font-bold text-gray-800">선택된 카피라이팅:</h4>
                  <p className="text-green-600">{selectedCopy}</p>
                </div>
              )}
            </div>
          );
      case 3:
        return (
          <div className="space-y-6">
            {renderNavigationButtons()}
            <h3 className="text-2xl font-bold text-gray-800">상세 페이지</h3>
            <div className="p-6 bg-white border-2 border-gray-200 rounded-2xl shadow-lg hover:shadow-xl transition duration-300 ease-in-out">
              <div dangerouslySetInnerHTML={{ __html: detailPage.replace(/\n/g, '<br>') }} />
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-6">
            {renderNavigationButtons()}
            <h3 className="text-2xl font-bold text-gray-800">웨비나 대본</h3>
            <div className="p-6 bg-white border-2 border-gray-200 rounded-2xl shadow-lg hover:shadow-xl transition duration-300 ease-in-out">
              <div dangerouslySetInnerHTML={{ __html: webinarScript.replace(/\n/g, '<br>') }} />
            </div>
          </div>
        );
      case 5:
        return (
          <div className="space-y-6">
            {renderNavigationButtons()}
            <h3 className="text-2xl font-bold text-gray-800">웨비나 홍보 카피</h3>
            <ul className="space-y-4">
              {promotionCopies.map((copy, index) => (
                <li key={index} className="flex items-center space-x-3 p-4 bg-white border-2 border-gray-200 rounded-xl hover:shadow-md transition duration-300 ease-in-out">
                  <ChevronRight className="text-blue-500 flex-shrink-0" size={20} />
                  <span className="text-gray-700 text-lg">{copy}</span>
                </li>
              ))}
            </ul>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white backdrop-filter backdrop-blur-lg bg-opacity-80 rounded-3xl shadow-2xl overflow-hidden">
          <div className="px-8 py-6 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
            <h1 className="text-4xl font-extrabold text-white text-center tracking-wide">비즈니스 아이디어 생성기</h1>
          </div>

          <div className="p-8">
            <div className="mb-12">
              <div className="flex justify-between items-center">
                {steps.map((step, index) => (
                  <div key={index} className="flex flex-col items-center group">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-500 ${index === currentStep ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white scale-110 shadow-lg' :
                        index < currentStep ? 'bg-gradient-to-r from-green-400 to-blue-500 text-white' : 'bg-gray-200 text-gray-500 group-hover:bg-gray-300'
                      }`}>
                      {index < currentStep ? <CheckCircle2 size={32} /> : <step.icon size={32} />}
                    </div>
                    <span className="text-sm mt-2 font-medium text-gray-600 group-hover:text-gray-900 transition-colors duration-300">{step.name}</span>
                  </div>
                ))}
              </div>
              <div className="h-2 bg-gray-200 mt-8 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 transition-all duration-500 ease-out"
                  style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
                ></div>
              </div>
            </div>
            <form onSubmit={handleSubmit} className="space-y-8">
              {renderStepContent()}

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full px-8 py-4 bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-600 text-white text-lg font-semibold rounded-full shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-blue-300 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    생성 중...
                  </div>
                ) : (
                  currentStep === steps.length - 1 ? '완료' : '다음 단계'
                )}
              </button>
            </form>

            <Alert className="mt-10 bg-blue-50 border-2 border-blue-200 rounded-xl">
              <Lightbulb className="h-6 w-6 text-blue-500" />
              <AlertTitle className="text-blue-700 font-bold text-lg">작성 팁</AlertTitle>
              <AlertDescription className="text-blue-600 text-base">
                {tips[currentStep]}
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessIdeaGenerator;