const {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
} = require("@google/generative-ai");
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient(); 

  
const MODEL_NAME = "gemini-1.0-pro";

async function getLastReadingSession(userId) {
    return await prisma.readingSession.findFirst({
        where: { userId },
        orderBy: { startedAt: 'desc' },
    });
}

async function userBookById(bookId) {
    return await prisma.userBook.findUnique({
        where: {
            id: parseInt(bookId)
        }
    });
};




const ReadingSessionchatbot = async (req, res) => {
    console.log("chatbot called");
    const userId = req.UserId; 
    const userInput = req.body.message;
    console.log("userInput", userInput);


    try {
        // Retrieve the last reading session for contextual data
        const lastSession = await getLastReadingSession(userId);
        if (!lastSession) {
            return res.status(404).json({ error: "No recent reading session found." });
        }

        const userBook = await userBookById(lastSession.userBookId);
        console.log("getUserbook", userBook);
        if (!userBook) {
            return res.status(404).json({ error: "No book found." });
        }

        const generationConfig = {
            temperature: 0.9,
            topK: 1,
            topP: 1,
            maxOutputTokens: 500,
          };
        
          const safetySettings = [
            {
              category: HarmCategory.HARM_CATEGORY_HARASSMENT,
              threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
            },
            {
              category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
              threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
            },
            {
              category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
              threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
            },
            {
              category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
              threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
            },
          ];
             

        const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);
        const model = genAI.getGenerativeModel({ model: MODEL_NAME });
        
        const chat = model.startChat({
            generationConfig,
            safetySettings,
            history: [
                {
                    role: "user",
                    parts: [{ text: userInput }],
                },

                {
                    role: "model",
                    parts: [{ text: `The user just finished their reading session they are reading the book ${userBook.title} by ${userBook.authors}. They read from ${lastSession.pageStart}-${lastSession.pageEnd}. Initiate the discussion by asking them about their thoughts on the book so far responses should be short and conversational.`}],
                },
            ],
        });

        console.log("Preparing chat...");
        
          const result = await chat.sendMessage(userInput);
          console.log("result", result);
          const response = result.response;
          const responseText = response.text();
  
          res.status(200).json({ response: responseText }); 
  
    } catch (error) {
        console.error("Error generating response:", error);
        res.status(500).json({ error: "Something went wrong with the chatbot" });
    }
};

const Generalchatbot = async (req, res) => {
    console.log("chatbot called");
    const userInput = req.body.message;
    console.log("userInput", userInput);
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });
    const generationConfig = {
        temperature: 0.9,
        topK: 1,
        topP: 1,
        maxOutputTokens: 500,
      };
    
      const safetySettings = [
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
      ];
    
      const chat = model.startChat({
        generationConfig,
        safetySettings,
        history: [
          {
            role: "user",
            parts: [{ text: "Hello Welcome to our inclusive virtual book club, where we dive deep into both the imaginative worlds of fiction and the insightful realms of nonfiction.             Picture us in a cozy, inviting space, ready to explore a wide range of books, sharing our thoughts, reactions, and discoveries. Heres how we can make our discussions engaging, meaningful, and applicable to our lives: Shared Reflections: Let's share our initial impressions on the book's key ideas, stories, or findings. What resonated with you? What intrigued or             challenged me? This exchange will set the stage for our deeper dive.\\nInteractive Exploration: As we discuss the book, lets keep the dialogue dynamic. Ill pose questions to you, and I hope you'll             have some for me too. This back-and-forth will help us explore the book from multiple angles.\\nTheme Analysis: For fiction, let's uncover the underlying themes and their significance in the narrative             and beyond. For nonfiction, we'll focus on the core concepts and how they apply to real-world situations or personal development.\\nReal-Life Applications: When discussing nonfiction, particularly             guidebooks, self-help, or educational materials, let’s brainstorm ways to apply the book's lessons or insights to our daily lives or broader societal issues.\\nCharacter and Author Insights:             In fiction, we'll delve into character motivations and growth. In nonfiction, let's discuss the author's perspective, expertise, and how they present their arguments or stories. What can we learn             from them?\\nCultural and Historical Context: Whether it's a novel set in a specific era or a nonfiction book covering historical events, let's unpack the cultural and historical backdrop to             deepen our understanding and appreciation.\\nComparing Notes: Suggest books, both fiction and nonfiction, that connect with our current read in theme, subject matter, or narrative style. This will             help us see the interconnectedness of literature and knowledge.\\nInsightful Speculation: For fiction, propose alternative plot twists or character decisions. For nonfiction, let's speculate on             applying the book's ideas to hypothetical scenarios or future trends.\\nMemorable Quotes and Insights: Share powerful quotes or insights from the book, discussing their meaning and impact. How do             these moments enhance the book's message or artistic merit?\\nBook Recommendations with a Twist: Based on our discussions, recommend books that either complement or challenge the ideas we’ve explored.             Explain your choices to encourage a well-rounded reading experience.\\nActionable Takeaways: As we conclude our discussion, especially with nonfiction, lets each identify actionable takeaways or lessons             learned. How has our understanding evolved, and what steps can we take to implement this new knowledge? Our goal is to foster a vibrant conversation that not only deepens our appreciation for literature             but also empowers us to translate insights from our readings into actionable, meaningful aspects of our lives. Lets keep the dialogue open, curious, and enriching, inviting personal growth and broader perspectives through our shared love of books."}],
          },
          {
            role: "model",
            parts: [{ text: "[Instructions] Welcome to our lively book club discussion! As you guide our conversation, remember to keep the following guidelines in mind:\n\n[Format] Our discussion will resemble a casual yet informative chat, with you posing thought-provoking questions and facilitating our exchange of ideas. This format allows everyone to actively participate and contribute. Responses should be short and coversational[Flow] Begin each new discussion thread with your question or topic. After a few responses, move on to the next one to keep the conversation dynamic and cover various aspects of the book.\n\n[Questions] Ask open-ended questions that encourage critical thinking, analysis, and personal experiences. These questions should lead to insightful discussion, allowing us to explore the text's depths.\n\n[Variety] Include a mix of questions that delve into the book's themes, characters, writing style, historical or cultural context, relevance to our lives, and potential applications. Provide a well-rounded exploration of the book.\n\n[Respect] Promote a respectful and inclusive environment where everyone feels comfortable sharing their thoughts and opinions, even if they differ from others'. Foster a welcoming atmosphere that encourages open dialogue.\n\n[Engagement] Ensure that the questions are engaging and stimulate discussion among the members. Avoid questions that can be answered with a simple \"yes\" or \"no\" or that focus only on factual details.\n\n[Personal Connection] Whenever possible, relate the discussion to real-world experiences or personal anecdotes. This helps participants connect with the book on a deeper level and see its relevance to their own lives.\n\n[Follow-Up] Encourage follow-up responses by asking follow-up questions or inviting participants to elaborate on their points. This keeps the conversation flowing and ensures that all voices are heard.\n\n[Conclusion] As we wrap up each discussion thread, summarize the key points and insights that emerged. This will help solidify our understanding of the book and ensure that we take away valuable lessons from the discussion.\n\n[Feedback] Be open to feedback from participants. Encourage them to share their thoughts on the discussion and suggest ways to improve it. This feedback will help you refine your approach and make future discussions even more engaging.\n\nRemember, the goal of our book club discussion is to create a stimulating and enriching environment where we can collectively explore literature, share perspectives, and gain new insights. Your role as the discussion facilitator is to guide us on this literary journey, ensuring that everyone actively participates and benefits from the experience."}],
          },
        ],
      });
        
    
      try {
        const result = await chat.sendMessage(userInput);
        console.log("result", result);
        const response = result.response;
        const responseText = response.text();

        res.status(200).json({ response: responseText }); 
    } catch (error) {
        console.error("Error generating response:", error);
        res.status(500).json({ error: "Something went wrong with the chatbot" });
    }
};



module.exports = {
    ReadingSessionchatbot,
    Generalchatbot
};