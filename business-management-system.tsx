import React, { useState, useEffect } from 'react';
import { FileUpload, FilePlus, Package, PieChart, ShoppingCart, Search, Smartphone, Home, Settings, LogOut } from 'lucide-react';

// מערכת ניהול עסק מתקדמת עם תמיכה בעברית
const BusinessManagementSystem = () => {
  // ניהול מצב המערכת
  const [activeTab, setActiveTab] = useState('dashboard');
  const [orders, setOrders] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  
  // נתונים לדוגמה
  useEffect(() => {
    // הזמנות לדוגמה
    setOrders([
      { id: 1, customer: 'ישראל ישראלי', items: 3, total: 450, status: 'הושלם', date: '2025-05-01' },
      { id: 2, customer: 'חנה כהן', items: 1, total: 120, status: 'בעיבוד', date: '2025-05-03' },
      { id: 3, customer: 'יוסף לוי', items: 5, total: 780, status: 'נשלח', date: '2025-05-04' },
      { id: 4, customer: 'שרה אברהם', items: 2, total: 350, status: 'בעיבוד', date: '2025-05-06' },
    ]);
    
    // מלאי לדוגמה
    setInventory([
      { id: 101, name: 'מחשב נייד', category: 'אלקטרוניקה', quantity: 15, price: 3500 },
      { id: 102, name: 'טלפון חכם', category: 'אלקטרוניקה', quantity: 28, price: 1800 },
      { id: 103, name: 'שולחן עבודה', category: 'ריהוט', quantity: 7, price: 850 },
      { id: 104, name: 'כיסא משרדי', category: 'ריהוט', quantity: 12, price: 450 },
      { id: 105, name: 'מקלדת', category: 'אלקטרוניקה', quantity: 32, price: 180 },
      { id: 106, name: 'עכבר אלחוטי', category: 'אלקטרוניקה', quantity: 45, price: 120 },
    ]);
  }, []);
  
  // תבניות מסמכים
  const documentTemplates = [
    { id: 1, name: 'חשבונית', type: 'invoice' },
    { id: 2, name: 'הצעת מחיר', type: 'quote' },
    { id: 3, name: 'תעודת משלוח', type: 'delivery' },
    { id: 4, name: 'קבלה', type: 'receipt' },
  ];
  
  // פונקציות לטיפול בנתונים
  const exportData = () => {
    const dataToExport = {
      orders: orders,
      inventory: inventory,
      exportDate: new Date().toISOString()
    };
    
    const jsonData = JSON.stringify(dataToExport, null, 2);
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `business-data-${new Date().toLocaleDateString('he-IL')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };
  
  const importData = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedData = JSON.parse(e.target.result);
          if (importedData.orders && importedData.inventory) {
            setOrders(importedData.orders);
            setInventory(importedData.inventory);
            alert('נתונים יובאו בהצלחה!');
          } else {
            alert('פורמט קובץ לא תקין');
          }
        } catch (error) {
          alert('שגיאה בייבוא הקובץ: ' + error.message);
        }
      };
      reader.readAsText(file);
    }
  };
  
  // פונקציות לסינון וחיפוש
  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.name.includes(searchTerm) || 
                          item.category.includes(searchTerm) || 
                          item.id.toString().includes(searchTerm);
    const matchesCategory = filterCategory === 'all' || item.category === filterCategory;
    return matchesSearch && matchesCategory;
  });
  
  const categories = ['all', ...new Set(inventory.map(item => item.category))];
  
  // סטטיסטיקות עסקיות
  const businessStats = {
    totalOrders: orders.length,
    completedOrders: orders.filter(o => o.status === 'הושלם').length,
    totalRevenue: orders.reduce((sum, order) => sum + order.total, 0),
    inventoryValue: inventory.reduce((sum, item) => sum + (item.price * item.quantity), 0),
    lowStockItems: inventory.filter(item => item.quantity < 10).length
  };
  
  // חישוב נתונים לתרשים מכירות
  const chartData = [
    { name: 'ינואר', sales: 12000 },
    { name: 'פברואר', sales: 19000 },
    { name: 'מרץ', sales: 15000 },
    { name: 'אפריל', sales: 22000 },
    { name: 'מאי', sales: 28000 },
  ];
  
  // רכיב לתצוגת תבנית מסמך
  const DocumentTemplateModal = () => {
    if (!showTemplateModal) return null;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg shadow-xl p-6 max-w-2xl w-full">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold">תבנית מסמך: {selectedTemplate?.name}</h3>
            <button 
              onClick={() => setShowTemplateModal(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              סגור ×
            </button>
          </div>
          
          <div className="bg-gray-100 p-4 rounded-lg mb-4">
            <div className="border-b-2 border-blue-500 pb-4 mb-4">
              <div className="flex justify-between">
                <div>
                  <h2 className="text-xl font-bold text-blue-600">העסק שלי בע"מ</h2>
                  <p>רחוב הראשי 123, תל אביב</p>
                  <p>טלפון: 03-1234567</p>
                  <p>עוסק מורשה: 123456789</p>
                </div>
                <div className="text-right">
                  <h3 className="font-bold text-lg">{selectedTemplate?.name}</h3>
                  <p>מספר: 10045</p>
                  <p>תאריך: {new Date().toLocaleDateString('he-IL')}</p>
                </div>
              </div>
            </div>
            
            <div className="mb-4">
              <h4 className="font-bold mb-2">פרטי לקוח:</h4>
              <p>שם: ישראל ישראלי</p>
              <p>כתובת: רחוב האלון 42, חיפה</p>
              <p>טלפון: 050-1234567</p>
            </div>
            
            <table className="w-full border-collapse mb-4">
              <thead>
                <tr className="bg-blue-100">
                  <th className="border p-2 text-right">#</th>
                  <th className="border p-2 text-right">פריט</th>
                  <th className="border p-2 text-right">כמות</th>
                  <th className="border p-2 text-right">מחיר</th>
                  <th className="border p-2 text-right">סה"כ</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-2">1</td>
                  <td className="border p-2">מחשב נייד</td>
                  <td className="border p-2">1</td>
                  <td className="border p-2">₪3,500</td>
                  <td className="border p-2">₪3,500</td>
                </tr>
                <tr>
                  <td className="border p-2">2</td>
                  <td className="border p-2">עכבר אלחוטי</td>
                  <td className="border p-2">1</td>
                  <td className="border p-2">₪120</td>
                  <td className="border p-2">₪120</td>
                </tr>
              </tbody>
              <tfoot>
                <tr className="bg-gray-100">
                  <td colSpan="4" className="border p-2 text-right font-bold">סה"כ:</td>
                  <td className="border p-2 font-bold">₪3,620</td>
                </tr>
                <tr className="bg-gray-100">
                  <td colSpan="4" className="border p-2 text-right font-bold">מע"מ (17%):</td>
                  <td className="border p-2 font-bold">₪615.40</td>
                </tr>
                <tr className="bg-blue-100">
                  <td colSpan="4" className="border p-2 text-right font-bold">סה"כ כולל מע"מ:</td>
                  <td className="border p-2 font-bold">₪4,235.40</td>
                </tr>
              </tfoot>
            </table>
            
            <div className="flex justify-between mt-8">
              <div>
                <p className="font-bold">הערות:</p>
                <p>תוקף המסמך: 30 יום</p>
              </div>
              <div className="text-center border-t pt-2">
                <p>חתימה וחותמת</p>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end gap-2">
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md">
              הדפס
            </button>
            <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md">
              שלח במייל
            </button>
            <button className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md">
              שמור כ-PDF
            </button>
          </div>
        </div>
      </div>
    );
  };

  // הצגת המערכת
  return (
    <div dir="rtl" className="flex h-screen bg-gray-100 text-right">
      {/* תפריט צד */}
      <div className="w-20 md:w-64 bg-blue-700 text-white flex flex-col">
        <div className="p-4 text-center">
          <h1 className="text-xl font-bold hidden md:block">מערכת ניהול עסק</h1>
          <div className="flex justify-center md:hidden">
            <Settings size={24} />
          </div>
        </div>
        
        <nav className="flex-1">
          <ul>
            <li className={`hover:bg-blue-800 ${activeTab === 'dashboard' ? 'bg-blue-800' : ''}`}>
              <button 
                onClick={() => setActiveTab('dashboard')} 
                className="w-full p-3 flex items-center justify-center md:justify-start space-x-2 space-x-reverse"
              >
                <Home size={20} />
                <span className="hidden md:inline">דשבורד</span>
              </button>
            </li>
            <li className={`hover:bg-blue-800 ${activeTab === 'documents' ? 'bg-blue-800' : ''}`}>
              <button 
                onClick={() => setActiveTab('documents')} 
                className="w-full p-3 flex items-center justify-center md:justify-start space-x-2 space-x-reverse"
              >
                <FilePlus size={20} />
                <span className="hidden md:inline">מסמכים</span>
              </button>
            </li>
            <li className={`hover:bg-blue-800 ${activeTab === 'inventory' ? 'bg-blue-800' : ''}`}>
              <button 
                onClick={() => setActiveTab('inventory')} 
                className="w-full p-3 flex items-center justify-center md:justify-start space-x-2 space-x-reverse"
              >
                <Package size={20} />
                <span className="hidden md:inline">מלאי</span>
              </button>
            </li>
            <li className={`hover:bg-blue-800 ${activeTab === 'orders' ? 'bg-blue-800' : ''}`}>
              <button 
                onClick={() => setActiveTab('orders')} 
                className="w-full p-3 flex items-center justify-center md:justify-start space-x-2 space-x-reverse"
              >
                <ShoppingCart size={20} />
                <span className="hidden md:inline">הזמנות</span>
              </button>
            </li>
            <li className={`hover:bg-blue-800 ${activeTab === 'data' ? 'bg-blue-800' : ''}`}>
              <button 
                onClick={() => setActiveTab('data')} 
                className="w-full p-3 flex items-center justify-center md:justify-start space-x-2 space-x-reverse"
              >
                <FileUpload size={20} />
                <span className="hidden md:inline">ניהול נתונים</span>
              </button>
            </li>
          </ul>
        </nav>
        
        <div className="p-4">
          <button className="w-full flex items-center justify-center md:justify-start space-x-2 space-x-reverse text-sm py-2 hover:bg-blue-800 rounded">
            <LogOut size={20} />
            <span className="hidden md:inline">התנתק</span>
          </button>
        </div>
      </div>
      
      {/* תוכן ראשי */}
      <div className="flex-1 overflow-auto">
        {/* כותרת */}
        <header className="bg-white shadow px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">
            {activeTab === 'dashboard' && 'דשבורד'}
            {activeTab === 'documents' && 'מחולל מסמכים'}
            {activeTab === 'inventory' && 'ניהול מלאי'}
            {activeTab === 'orders' && 'ניהול הזמנות'}
            {activeTab === 'data' && 'ייבוא/ייצוא נתונים'}
          </h2>
          <div className="flex items-center space-x-4 space-x-reverse">
            <span className="text-sm text-gray-600">שלום, מנהל</span>
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
              מ
            </div>
          </div>
        </header>
        
        {/* תוכן הדף */}
        <main className="p-6">
          {/* דשבורד */}
          {activeTab === 'dashboard' && (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-gray-600">סה"כ הזמנות</h3>
                    <ShoppingCart className="text-blue-500" />
                  </div>
                  <p className="text-3xl font-bold">{businessStats.totalOrders}</p>
                  <p className="text-sm text-gray-500">הזמנות שהושלמו: {businessStats.completedOrders}</p>
                </div>
                
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-gray-600">הכנסות</h3>
                    <PieChart className="text-green-500" />
                  </div>
                  <p className="text-3xl font-bold">₪{businessStats.totalRevenue}</p>
                  <p className="text-sm text-green-500">+12% מהחודש שעבר</p>
                </div>
                
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-gray-600">ערך מלאי</h3>
                    <Package className="text-purple-500" />
                  </div>
                  <p className="text-3xl font-bold">₪{businessStats.inventoryValue}</p>
                  <p className="text-sm text-gray-500">פריטים במלאי: {inventory.length}</p>
                </div>
                
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-gray-600">מלאי נמוך</h3>
                    <Search className="text-red-500" />
                  </div>
                  <p className="text-3xl font-bold">{businessStats.lowStockItems}</p>
                  <p className="text-sm text-red-500">פריטים להזמנה מחדש</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-white rounded-lg shadow p-6 lg:col-span-2">
                  <h3 className="font-bold text-lg mb-4">ניתוח מכירות</h3>
                  <div className="h-64 flex items-center justify-center">
                    <div className="w-full h-full flex items-end space-x-1 space-x-reverse">
                      {chartData.map((item, index) => (
                        <div key={index} className="flex-1 flex flex-col items-center">
                          <div 
                            className="w-full bg-blue-500 rounded-t" 
                            style={{ height: `${(item.sales / 30000) * 100}%` }}
                          ></div>
                          <p className="text-xs mt-2">{item.name}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="font-bold text-lg mb-4">הזמנות אחרונות</h3>
                  <ul>
                    {orders.slice(0, 4).map(order => (
                      <li key={order.id} className="border-b py-3 last:border-b-0">
                        <div className="flex justify-between">
                          <span className="font-medium">{order.customer}</span>
                          <span className="font-bold">₪{order.total}</span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-600 mt-1">
                          <span>{order.date}</span>
                          <span className={`
                            ${order.status === 'הושלם' ? 'text-green-500' : ''}
                            ${order.status === 'בעיבוד' ? 'text-yellow-500' : ''}
                            ${order.status === 'נשלח' ? 'text-blue-500' : ''}
                          `}>{order.status}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                  <button className="mt-4 text-blue-500 text-sm hover:underline">
                    צפה בכל ההזמנות
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {/* מחולל מסמכים */}
          {activeTab === 'documents' && (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-bold text-lg mb-6">מחולל מסמכים</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {documentTemplates.map(template => (
                  <div 
                    key={template.id}
                    className="border rounded-lg p-6 cursor-pointer hover:border-blue-500 hover:shadow-md transition-all"
                    onClick={() => {
                      setSelectedTemplate(template);
                      setShowTemplateModal(true);
                    }}
                  >
                    <div className="flex justify-center mb-4">
                      <FilePlus size={48} className="text-blue-500" />
                    </div>
                    <h4 className="text-lg font-medium text-center">{template.name}</h4>
                    <p className="text-gray-500 text-sm text-center mt-2">לחץ ליצירה</p>
                  </div>
                ))}
                
                <div className="border border-dashed rounded-lg p-6 cursor-pointer hover:border-green-500 hover:shadow-md transition-all flex flex-col items-center justify-center">
                  <div className="flex justify-center mb-4">
                    <FilePlus size={48} className="text-green-500" />
                  </div>
                  <h4 className="text-lg font-medium text-center">צור תבנית חדשה</h4>
                </div>
              </div>
              
              <div className="mt-8">
                <h4 className="font-bold mb-4">מסמכים אחרונים</h4>
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border p-2 text-right">שם</th>
                      <th className="border p-2 text-right">סוג</th>
                      <th className="border p-2 text-right">נוצר</th>
                      <th className="border p-2 text-right">פעולות</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border p-2">חשבונית #10045</td>
                      <td className="border p-2">חשבונית</td>
                      <td className="border p-2">06/05/2025</td>
                      <td className="border p-2">
                        <div className="flex space-x-2 space-x-reverse">
                          <button className="text-blue-500 hover:text-blue-700">צפה</button>
                          <button className="text-gray-500 hover:text-gray-700">ערוך</button>
                          <button className="text-red-500 hover:text-red-700">מחק</button>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td className="border p-2">הצעת מחיר #8072</td>
                      <td className="border p-2">הצעת מחיר</td>
                      <td className="border p-2">04/05/2025</td>
                      <td className="border p-2">
                        <div className="flex space-x-2 space-x-reverse">
                          <button className="text-blue-500 hover:text-blue-700">צפה</button>
                          <button className="text-gray-500 hover:text-gray-700">ערוך</button>
                          <button className="text-red-500 hover:text-red-700">מחק</button>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td className="border p-2">תעודת משלוח #3025</td>
                      <td className="border p-2">תעודת משלוח</td>
                      <td className="border p-2">01/05/2025</td>
                      <td className="border p-2">
                        <div className="flex space-x-2 space-x-reverse">
                          <button className="text-blue-500 hover:text-blue-700">צפה</button>
                          <button className="text-gray-500 hover:text-gray-700">ערוך</button>
                          <button className="text-red-500 hover:text-red-700">מחק</button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
          
          {/* ניהול מלאי */}
          {activeTab === 'inventory' && (
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-lg">ניהול מלאי</h3>
                <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md">
                  הוסף פריט חדש
                </button>
              </div>
              
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="text"
                      placeholder="חפש פריטים..."
                      className="w-full pl-4 pr-10 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="md:w-1/4">
                  <select
                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                  >
                    <option value="all">כל הקטגוריות</option>
                    {categories.filter(c => c !== 'all').map((category, index) => (
                      <option key={index} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border p-2 text-right">מק"ט</th>
                      <th className="border p-2 text-right">שם פריט</th>
                      <th className="border p-2 text-right">קטגוריה</th>
                      <th className="border p-2 text-right">כמות</th>
                      <th className="border p-2 text-right">מחיר</th>
                      <th className="border p-2 text-right">פעולות</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredInventory.map(item => (
                      <tr key={item.id}>
                        <td className="border p-2">{item.id}</td>
                        <td className="border p-2">{item.name}</td>
                        <td className="border p-2">{item.category}</td>
                        <td className="border p-2" style={{ color: item.quantity < 10 ? 'red' : 'inherit' }}>{item.quantity}</td>
                        <td className="border p-2">₪{item.price}</td>
                        <td className="border p-2">
                          <div className="flex space-x-2 space-x-reverse">
                            <button className="text-blue-500 hover:text-blue-700">צפה</button>
                            <button className="text-gray-500 hover:text-gray-700">ערוך</button>
                            <button className="text-red-500 hover:text-red-700">מחק</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="mt-4 text-gray-600 text-sm">
                מציג {filteredInventory.length} מתוך {inventory.length} פריטים
              </div>
            </div>
          )}
          
          {/* ניהול הזמנות */}
          {activeTab === 'orders' && (
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-lg">ניהול הזמנות</h3>
                <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md">
                  צור הזמנה חדשה
                </button>
              </div>
              
              <div className="flex gap-4 mb-6">
                <button className="px-4 py-2 border rounded-md hover:bg-gray-100 bg-white">כל ההזמנות</button>
                <button className="px-4 py-2 border rounded-md hover:bg-gray-100 bg-white">בעיבוד</button>
                <button className="px-4 py-2 border rounded-md hover:bg-gray-100 bg-white">נשלחו</button>
                <button className="px-4 py-2 border rounded-md hover:bg-gray-100 bg-white">הושלמו</button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border p-2 text-right">מזהה</th>
                      <th className="border p-2 text-right">לקוח</th>
                      <th className="border p-2 text-right">תאריך</th>
                      <th className="border p-2 text-right">פריטים</th>
                      <th className="border p-2 text-right">סכום</th>
                      <th className="border p-2 text-right">סטטוס</th>
                      <th className="border p-2 text-right">פעולות</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map(order => (
                      <tr key={order.id}>
                        <td className="border p-2">#{order.id}</td>
                        <td className="border p-2">{order.customer}</td>
                        <td className="border p-2">{order.date}</td>
                        <td className="border p-2">{order.items}</td>
                        <td className="border p-2">₪{order.total}</td>
                        <td className="border p-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium
                            ${order.status === 'הושלם' ? 'bg-green-100 text-green-800' : ''}
                            ${order.status === 'בעיבוד' ? 'bg-yellow-100 text-yellow-800' : ''}
                            ${order.status === 'נשלח' ? 'bg-blue-100 text-blue-800' : ''}
                          `}>
                            {order.status}
                          </span>
                        </td>
                        <td className="border p-2">
                          <div className="flex space-x-2 space-x-reverse">
                            <button className="text-blue-500 hover:text-blue-700">צפה</button>
                            <button className="text-gray-500 hover:text-gray-700">ערוך</button>
                            <button className="text-red-500 hover:text-red-700">מחק</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="mt-6 flex justify-between items-center">
                <div className="text-gray-600 text-sm">
                  מציג {orders.length} הזמנות
                </div>
                
                <div className="flex space-x-2 space-x-reverse">
                  <button className="px-3 py-1 border rounded-md hover:bg-gray-100">הקודם</button>
                  <button className="px-3 py-1 border rounded-md bg-blue-500 text-white">1</button>
                  <button className="px-3 py-1 border rounded-md hover:bg-gray-100">2</button>
                  <button className="px-3 py-1 border rounded-md hover:bg-gray-100">3</button>
                  <button className="px-3 py-1 border rounded-md hover:bg-gray-100">הבא</button>
                </div>
              </div>
            </div>
          )}
          
          {/* ייבוא/ייצוא נתונים */}
          {activeTab === 'data' && (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-bold text-lg mb-6">ניהול נתונים - ייבוא/ייצוא</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="border rounded-lg p-6">
                  <h4 className="font-bold text-lg mb-4 flex items-center">
                    <FileUpload className="mr-2 text-blue-500" />
                    ייבוא נתונים
                  </h4>
                  <p className="text-gray-600 mb-4">
                    העלה קובץ JSON לייבוא נתונים למערכת. הקובץ צריך להכיל מבנה תואם למערכת.
                  </p>
                  
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-4">
                    <input
                      type="file"
                      id="importFile"
                      className="hidden"
                      accept=".json"
                      onChange={importData}
                    />
                    <label htmlFor="importFile" className="cursor-pointer">
                      <FileUpload className="mx-auto mb-4 text-gray-400" size={48} />
                      <p className="text-gray-600 mb-2">גרור ושחרר קובץ כאן</p>
                      <p className="text-gray-400 text-sm mb-4">או</p>
                      <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md">
                        בחר קובץ
                      </button>
                    </label>
                  </div>
                  
                  <div className="text-sm text-gray-500">
                    <p className="mb-1">פורמטים נתמכים: .json</p>
                    <p>גודל מקסימלי: 10MB</p>
                  </div>
                </div>
                
                <div className="border rounded-lg p-6">
                  <h4 className="font-bold text-lg mb-4 flex items-center">
                    <Package className="mr-2 text-green-500" />
                    ייצוא נתונים
                  </h4>
                  <p className="text-gray-600 mb-6">
                    ייצא את הנתונים הנוכחיים במערכת לקובץ JSON לגיבוי או העברה למערכות אחרות.
                  </p>
                  
                  <div className="space-y-4">
                    <div className="p-4 border rounded-lg flex items-center justify-between">
                      <div>
                        <h5 className="font-medium">כל הנתונים</h5>
                        <p className="text-sm text-gray-500">ייצוא של כל הנתונים במערכת</p>
                      </div>
                      <button 
                        onClick={exportData}
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md"
                      >
                        ייצא הכל
                      </button>
                    </div>
                    
                    <div className="p-4 border rounded-lg flex items-center justify-between">
                      <div>
                        <h5 className="font-medium">נתוני מלאי</h5>
                        <p className="text-sm text-gray-500">ייצוא של נתוני המלאי בלבד</p>
                      </div>
                      <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md">
                        ייצא מלאי
                      </button>
                    </div>
                    
                    <div className="p-4 border rounded-lg flex items-center justify-between">
                      <div>
                        <h5 className="font-medium">נתוני הזמנות</h5>
                        <p className="text-sm text-gray-500">ייצוא של נתוני ההזמנות בלבד</p>
                      </div>
                      <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md">
                        ייצא הזמנות
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
      
      {/* מודאל תבנית מסמך */}
      <DocumentTemplateModal />
      
      {/* סרגל סטטוס למובייל */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around py-2">
        <button 
          onClick={() => setActiveTab('dashboard')} 
          className={`flex flex-col items-center p-1 ${activeTab === 'dashboard' ? 'text-blue-500' : 'text-gray-500'}`}
        >
          <Home size={24} />
          <span className="text-xs">דשבורד</span>
        </button>
        <button 
          onClick={() => setActiveTab('inventory')} 
          className={`flex flex-col items-center p-1 ${activeTab === 'inventory' ? 'text-blue-500' : 'text-gray-500'}`}
        >
          <Package size={24} />
          <span className="text-xs">מלאי</span>
        </button>
        <button 
          onClick={() => setActiveTab('orders')} 
          className={`flex flex-col items-center p-1 ${activeTab === 'orders' ? 'text-blue-500' : 'text-gray-500'}`}
        >
          <ShoppingCart size={24} />
          <span className="text-xs">הזמנות</span>
        </button>
        <button 
          onClick={() => setActiveTab('documents')} 
          className={`flex flex-col items-center p-1 ${activeTab === 'documents' ? 'text-blue-500' : 'text-gray-500'}`}
        >
          <FilePlus size={24} />
          <span className="text-xs">מסמכים</span>
        </button>
      </div>
    </div>
  );
};

export default BusinessManagementSystem;