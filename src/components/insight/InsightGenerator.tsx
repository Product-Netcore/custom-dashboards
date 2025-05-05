import React, { useState } from 'react';
import { useDashboard } from '@/contexts/DashboardContext';
import { Chart } from '@/types/dashboard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Predefined suggestion chips
const PREDEFINED_PROMPTS = [
  "Show revenue trend over the last 30 days",
  "What are my top performing campaigns?",
  "Give me retention by channel",
  "Compare user engagement across platforms"
];

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  chart?: Chart;
}

const InsightGenerator: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const { toast } = useToast();
  const { saveChart } = useDashboard();

  const handleSendMessage = (content: string) => {
    // Add user message
    const newUserMessage: Message = {
      id: `user-${Date.now()}`,
      content,
      sender: 'user'
    };
    
    setMessages(prevMessages => [...prevMessages, newUserMessage]);
    setInputMessage('');
    
    // Simulate AI response with mock data
    setTimeout(() => {
      const mockChart: Chart = {
        id: `chart-${Date.now()}`,
        title: content,
        description: "Generated from AI insight",
        type: content.toLowerCase().includes('trend') ? 'bar' : 'funnel',
        displayMode: 'chart',
        isFullWidth: false,
        data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
          values: [Math.random() * 1000, Math.random() * 1000, Math.random() * 1000, Math.random() * 1000, Math.random() * 1000]
        },
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      const newAiMessage: Message = {
        id: `ai-${Date.now()}`,
        content: `Here's the analysis for: "${content}"`,
        sender: 'ai',
        chart: mockChart
      };
      
      setMessages(prevMessages => [...prevMessages, newAiMessage]);
    }, 1000);
  };

  const handleSaveChart = (chart: Chart) => {
    console.log("Attempting to save chart:", chart);
    toast({
      title: "Save Chart Clicked",
      description: "Saving functionality for AI-generated charts needs implementation.",
    });
  };

  return (
    <div className="flex flex-col h-full p-6">
      <h1 className="text-2xl font-bold mb-6">Insight Generator</h1>
      
      {/* Chat messages container */}
      <div className="flex-grow overflow-y-auto mb-6 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <h2 className="text-xl font-medium mb-4">Ask for data insights</h2>
            <p className="text-muted-foreground mb-8">
              Get AI-generated analytics and visualizations by asking questions about your data
            </p>
          </div>
        ) : (
          messages.map((message) => (
            <div 
              key={message.id} 
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-[80%] rounded-lg p-4 ${
                  message.sender === 'user' 
                    ? 'bg-[#00A5EC] text-white rounded-tr-none' 
                    : 'bg-muted rounded-tl-none'
                }`}
              >
                <p>{message.content}</p>
                
                {message.chart && (
                  <div className="mt-4 bg-background rounded-md p-4 shadow-sm">
                    <div className="h-60 mb-4 bg-gray-100 flex items-center justify-center rounded">
                      <p className="text-muted-foreground">Chart visualization would appear here</p>
                    </div>
                    
                    <p className="text-sm mb-4">
                      The data shows significant patterns worth noting. Consider exploring these insights further.
                    </p>
                    
                    <Button 
                      variant="default"
                      className="bg-[#00A5EC] text-white hover:bg-[#0095D2]"
                      onClick={() => handleSaveChart(message.chart!)}
                    >
                      Save to Dashboard
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
      
      {/* Suggestion chips */}
      {messages.length === 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {PREDEFINED_PROMPTS.map((prompt) => (
            <Button
              key={prompt}
              variant="outline"
              className="rounded-full hover:bg-[#00A5EC]/10 border-[#00A5EC]/20 text-sm"
              onClick={() => handleSendMessage(prompt)}
            >
              {prompt}
            </Button>
          ))}
        </div>
      )}
      
      {/* Input area */}
      <div className="flex items-center gap-2">
        <Input
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Ask a question like 'Show DAUs by region' or 'Compare email vs WhatsApp engagement'"
          className="flex-grow"
          onKeyPress={(e) => {
            if (e.key === 'Enter' && inputMessage) {
              handleSendMessage(inputMessage);
            }
          }}
        />
        <Button 
          onClick={() => {
            if (inputMessage) {
              handleSendMessage(inputMessage);
            }
          }}
          className="bg-[#00A5EC] text-white hover:bg-[#0095D2]"
          size="icon"
          disabled={!inputMessage}
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default InsightGenerator;
