import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const botResponses = {
  greetings: [
    "Hey there, eco-friend! 🌿 I'm Eco Buddy! Ready to learn about our amazing planet?",
    "Hi! Welcome back! Let's save the Earth together! 🌍",
    "Hello! 🌟 Nature is calling! Let's explore!",
  ],
  trees: [
    "Trees are like the lungs of our planet! They breathe in CO2 and breathe out oxygen for us! 🌳",
    "Did you know? One tree can produce enough oxygen for 4 people to breathe! Amazing, right? 😮",
  ],
  animals: [
    "Animals are our friends! Each one plays a special role in nature! 🦁",
    "Some animals are endangered, which means there aren't many left. We need to protect them! 🐼",
  ],
  water: [
    "Water is precious! Only 1% of Earth's water is drinkable. Let's save every drop! 💧",
    "The water cycle is amazing! Water goes from rain → river → ocean → cloud → rain again! 🌊",
  ],
  recycling: [
    "Reduce, Reuse, Recycle! That's the magic mantra for our planet! ♻️",
    "Did you know? A plastic bottle takes 450 years to decompose! Always recycle! 🌱",
  ],
  encouragement: [
    "You're doing great! Keep learning and making a difference! 🌟",
    "Awesome work! You're becoming a true Eco Champion! 🏆",
    "Every little action helps our planet! You're amazing! 💚",
  ],
  default: [
    "That's a great question! Every day we learn something new about our environment! 🌿",
    "Keep being curious! The natural world is full of wonders! 🌍",
    "Nature is the best teacher! Let's explore more together! 🌱",
  ],
};

const EcoBuddyChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const greeting = botResponses.greetings[Math.floor(Math.random() * botResponses.greetings.length)];
      setMessages([{ text: greeting, sender: 'bot' }]);
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const getBotResponse = (userInput) => {
    const lower = userInput.toLowerCase();
    if (lower.includes('tree') || lower.includes('forest')) return botResponses.trees[Math.floor(Math.random() * botResponses.trees.length)];
    if (lower.includes('animal') || lower.includes('pet') || lower.includes('bird')) return botResponses.animals[Math.floor(Math.random() * botResponses.animals.length)];
    if (lower.includes('water') || lower.includes('ocean') || lower.includes('sea')) return botResponses.water[Math.floor(Math.random() * botResponses.water.length)];
    if (lower.includes('recycle') || lower.includes('plastic') || lower.includes('waste')) return botResponses.recycling[Math.floor(Math.random() * botResponses.recycling.length)];
    if (lower.includes('good') || lower.includes('great') || lower.includes('nice') || lower.includes('amazing')) return botResponses.encouragement[Math.floor(Math.random() * botResponses.encouragement.length)];
    if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey')) return botResponses.greetings[Math.floor(Math.random() * botResponses.greetings.length)];
    return botResponses.default[Math.floor(Math.random() * botResponses.default.length)];
  };

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg = { text: input, sender: 'user' };
    setMessages(prev => [...prev, userMsg]);
    setTimeout(() => {
      const botMsg = { text: getBotResponse(input), sender: 'bot' };
      setMessages(prev => [...prev, botMsg]);
    }, 500);
    setInput('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <>
      <button className="chatbot-toggle" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? '✕' : '🌿'}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="chatbot-window"
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
          >
            <div className="chatbot-header">
              <span style={{ fontSize: 32 }}>🌿</span>
              <div>
                <h3 style={{ color: 'white', fontFamily: "'Fredoka One', cursive" }}>Eco Buddy</h3>
                <small style={{ opacity: 0.8 }}>Your nature friend!</small>
              </div>
            </div>
            <div className="chatbot-messages">
              {messages.map((msg, i) => (
                <div key={i} className={`chat-message ${msg.sender}`}>{msg.text}</div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <div className="chatbot-input">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me about nature..."
              />
              <button className="btn btn-primary btn-sm" onClick={handleSend}>Send</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default EcoBuddyChatbot;