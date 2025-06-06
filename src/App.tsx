import CallHistoryPage from './components/CallHistoryPage';
import Header from './components/Header';

import { EventProvider } from "./context/EventContext"; 
import { MessageProvider } from './context/MessageContext';




function App() {


  return (
    <EventProvider>
      <MessageProvider>
        
        <div className="min-h-screen bg-slate-100">
          <Header onRefreshTargets={()=>{}} operatorName="Michael Anderson" unreadNotifications={10} />
          <div className="py-6">
            <CallHistoryPage />
          </div>
        </div>
      
      </MessageProvider>
    </EventProvider>
  );
}

export default App;