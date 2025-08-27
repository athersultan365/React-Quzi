import React, { useEffect, useState } from "react";

export default function NewQuiz() {
  const [category, setCategory] = useState([]);
  const [selectCategory, setSelectCategory] = useState("");
  const [questionno, setQuestionNo] = useState(10);
  const [difficulty, setDifficulty] = useState("easy");
  const [question, setQuestion] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [showBtn, setshowBtn] = useState(false);
  const [marks, setMarks] = useState(0);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        let response = await fetch(`https://opentdb.com/api_category.php`);
        let data = await response.json();
        setCategory(data.trivia_categories);
      } catch (error) {}
    };
    fetchCategory();
  }, []);

  const startQuiz = () => {
    const fetchQuiz = async () => {
      try {
        let response = await fetch(
          `https://opentdb.com/api.php?amount=${questionno}&category=${selectCategory}&difficulty=${difficulty}&type=multiple`
        );

        let data = await response.json();

        setQuestion(data.results);
        setShowResult(false);
        setAnswers(new Array(data.results.lenght).fill(""));
        setCorrectCount(0);
        setshowBtn(true);
      } catch (error) {
        console.log("Error", error);
      }
    };
    fetchQuiz();
  };

  const handleAnswer = (item, j) => {
    let update = [...answers];
    update[j] = item;
    setAnswers(update);
  };

  const showResults = () => {
    let count = 0;
    let marksCount = 0
    answers.forEach((answer, index) => {
      if (answer === question[index].correct_answer) {
        count++;
        marksCount = marksCount+5
      }
      // const setmarks = () => {
      //   marks = 2;
      // };
    });
    setCorrectCount(count);
    setMarks(marksCount);
    setShowResult(true);
  };

  console.log(marks, correctCount);
  

  return (
    <>
      <div className="w-full bg-gray-500 h-full p-5 py-8  ">
        <h1 className="text-[40px] text-center text-white font-bold  mb-10">
          New quiz App
        </h1>
        <div className="w-1/2 m-auto bg-gray-400 p-5 rounded-lg shadow-lg">
          <div className="mb-5">
            <label className="text-white text-lg"> Select Category:</label>
            <select
              value={selectCategory}
              onChange={(e) => setSelectCategory(e.target.value)}
              className="w-full  p-2 mt-1 bg-gray-800 text-white rounded-md"
            >
              <option value={""}>Any Category</option>
              {category.map((ele) => (
                <option key={ele.id} value={ele.id}>
                  {ele.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-5">
            <label className="text-white text-lg">No of Question</label>
            <input
              value={questionno}
              type="Number"
              onChange={(e) => setQuestionNo(e.target.value)}
              className="w-full p-2 mt-1 bg-gray-800 text-white rounded-md"
            />
          </div>

          <div className="mb-5">
            <lable className="text-white text-lg"> Question Defficulty</lable>
            <select
              value={difficulty}
              type="text"
              onChange={(e) => setDifficulty(e.target.value)}
              className=" w-full p-2 mt-1 bg-gray-800 text-white rounded-md"
            >
              <option value="easy">Easy</option>
              <option value="medium">medium</option>
              <option value="hard">hard</option>
            </select>
          </div>

          <button
            onClick={startQuiz}
            className="w-full bg-blue-700 text-center text-black p-3 mt-3 font-sans hover:bg-blue-600 "
          >
            StartQuiz
          </button>
        </div>
        <div className="mb-10">
          {question.map((ele, i) => {
            let allanswers = [...ele.incorrect_answers, ele.correct_answer];
            return (
              <div
                key={i}
                className="bg-gray-600 p-5 mt-5 rounded-lg shadow-lg"
              >
                <h2 className="text-white text-xl md-3">
                  {" "}
                  Q{i + 1} {ele.question}
                </h2>
                {allanswers.map((item, j) => (
                  <label key={j} className="block text-white mb-2">
                    <input
                      type="radio"
                      onChange={() => handleAnswer(item, i)}
                      value={item}
                      name={`question${i}`}
                      checked={answers[i] === item}
                      className="mr-2"
                    />
                    {item}
                  </label>
                ))}
              </div>
            );
          })}

          {showBtn ? (
            <button
              onClick={showResults}
              className="w-full p-3 mt-10 bg-green-400 text-white font-sans rounded-md hover:bg-green-500"
            >
              show Results
            </button>
          ) : (
            <h1></h1>
          )}

          <div className="mt-10">
            {showResult && (
              <div className="bg-gray-800 p-5 rounded-lg shadow-lg">
                <h2 className="text-white text-2xl "> Results</h2>

                {question.map((ele, i) => (
                  <div key={i} className="md-3">
                    <h3 className="text-white text-lg">
                      Question{i + 1} :{ele.question}
                    </h3>

                    <p className="text-white"> Your Anwser:{answers[i]}</p>
                    <p className="text-white">
                      Correct Anwser: {ele.correct_answer}
                    </p>
                  </div>
                ))}

                <h2 className="text-white text-xl mt-5">
                  Total Correct Auswers:{correctCount}
                </h2>
                <h2 className="text-white text-xl mt-5">Get No: {marks}</h2>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
