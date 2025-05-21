import React, { useState } from 'react';
import { useDashboard } from '@/contexts/DashboardContext';
import { Chart } from '@/types/dashboard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import AddToAnotherDashboardModal from '@/components/dashboard/AddToAnotherDashboardModal';

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
  const { saveChart, addChartToExistingDashboard, createDashboardWithChart } = useDashboard();

  // State for controlling the Add to Dashboard modal
  const [isAddToDashboardModalOpen, setIsAddToDashboardModalOpen] = useState(false);
  const [selectedAiChart, setSelectedAiChart] = useState<Chart | null>(null);

  const handleSendMessage = (content: string) => {
    const newUserMessage: Message = {
      id: `user-${Date.now()}`,
      content,
      sender: 'user'
    };
    
    setMessages(prevMessages => [...prevMessages, newUserMessage]);
    setInputMessage('');
    
    setTimeout(() => {
      const mockChart: Chart = {
        id: `chart-${Date.now()}`,
        title: content,
        description: "Generated from AI insight",
        type: content.toLowerCase().includes('trend') ? 'bar' : 'funnel',
        displayMode: 'chart',
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

  const handleOpenAddToDashboardModal = (chart: Chart) => {
    setSelectedAiChart(chart);
    setIsAddToDashboardModalOpen(true);
  };

  const handleSaveChart = (chart: Chart) => {
    console.log("Attempting to add chart to dashboard:", chart);
    setSelectedAiChart(chart);
    setIsAddToDashboardModalOpen(true);
  };

  return (
    <div className="flex flex-col h-full p-6">
      <h1 className="text-2xl font-bold mb-6">Insight Generator</h1>
      
      {messages.length > 0 ? (
        <div className="flex-grow overflow-y-auto mb-4 space-y-4">
          {messages.map((message) => (
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
                      style={{ backgroundColor: '#143F93' }}
                      className="text-white hover:opacity-90"
                      onClick={() => handleOpenAddToDashboardModal(message.chart!)}
                    >
                      Add to Dashboard
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className="flex-grow"></div>
          <div className="text-center mb-10">
            <h2 className="text-xl font-medium mb-4">Ask for data insights</h2>
            <p className="text-muted-foreground mb-8">
              Get AI-generated analytics and visualizations by asking questions about your data
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {PREDEFINED_PROMPTS.map((prompt) => (
                <Button
                  key={prompt}
                  variant="outline"
                  className="rounded-full hover:bg-[#00A5EC]/10 border-[#00A5EC]/20 text-sm text-[#00A5EC] hover:text-[#0095D2]"
                  onClick={() => handleSendMessage(prompt)}
                >
                  {prompt}
                </Button>
              ))}
            </div>
          </div>
        </>
      )}
      
      <div className="flex items-center gap-2 pt-4 border-t border-gray-200 mt-auto">
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

      {selectedAiChart && (
        <AddToAnotherDashboardModal
          isOpen={isAddToDashboardModalOpen}
          onClose={() => setIsAddToDashboardModalOpen(false)}
          chartToAdd={selectedAiChart}
          currentDashboardId={null}
        />
      )}
    </div>
  );
};

export default InsightGenerator;
