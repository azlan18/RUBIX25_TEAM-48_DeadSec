import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { ShoppingCart, ArrowDown, ArrowUp } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';

// TypeScript Interface for Purchase History
interface PurchaseEntry {
  _id: string;
  userId: string;
  purchaseDate: string;
  purchased: {
    product: string;
    eco_score: number;
    water_usage: number;
    carbon_footprint: number;
    waste_generated?: number;
  };
  alternative: {
    product: string;
    eco_score: number;
    water_usage: number;
    carbon_footprint: number;
    waste_generated?: number;
  };
}

export default function TransactionHistoryPage() {
  const [purchases, setPurchases] = useState<PurchaseEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof PurchaseEntry['purchased'] | 'date';
    direction: 'ascending' | 'descending';
  }>({
    key: 'date',
    direction: 'descending'
  });

  // Fetch Purchase History
  useEffect(() => {
    const fetchPurchaseHistory = async () => {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        toast.error('Please log in to view purchase history');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`http://localhost:3000/purchase-history/${userId}`);
        setPurchases(response.data.purchases);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching purchase history:', error);
        toast.error('Failed to load purchase history');
        setLoading(false);
      }
    };

    fetchPurchaseHistory();
  }, []);

  // Sorting Function
  const sortedPurchases = React.useMemo(() => {
    let sortablePurchases = [...purchases];
    
    sortablePurchases.sort((a, b) => {
      if (sortConfig.key === 'date') {
        const dateA = new Date(a.purchaseDate).getTime();
        const dateB = new Date(b.purchaseDate).getTime();
        return sortConfig.direction === 'ascending' 
          ? dateA - dateB 
          : dateB - dateA;
      }

      const valueA = a.purchased[sortConfig.key as keyof PurchaseEntry['purchased']] || 0;
      const valueB = b.purchased[sortConfig.key as keyof PurchaseEntry['purchased']] || 0;

      return sortConfig.direction === 'ascending'
        ? Number(valueA) - Number(valueB)
        : Number(valueB) - Number(valueA);
    });

    return sortablePurchases;
  }, [purchases, sortConfig]);

  // Sorting Handler
  const requestSort = (key: keyof PurchaseEntry['purchased'] | 'date') => {
    let direction: 'ascending' | 'descending' = 'descending';
    if (
      sortConfig.key === key && 
      sortConfig.direction === 'descending'
    ) {
      direction = 'ascending';
    }
    setSortConfig({ key, direction });
  };

  // Render Loading State
  if (loading) {
    return (
      <section className="py-24 bg-[#ffffff] relative overflow-hidden mt-16">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-[#151616] font-bold"
          >
            Loading Purchase History...
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 bg-[#ffffff] relative overflow-hidden mt-16">
      <Toaster position="top-right" />
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          {/* Page Title */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 bg-[#151616] text-white rounded-full px-4 py-2 mb-4"
            >
              <ShoppingCart className="w-4 h-4 text-[#D6F32F]" />
              <span className="text-sm font-medium">Purchase History</span>
            </motion.div>
          </div>

          {/* Purchase History Table */}
          {purchases.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl p-8 border-2 border-[#151616] shadow-[4px_4px_0px_0px_#151616] text-center"
            >
              <p className="text-[#151616]">No purchase history found.</p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl p-6 border-2 border-[#151616] shadow-[4px_4px_0px_0px_#151616] overflow-x-auto"
            >
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-[#151616]/20">
                    <th 
                      className="p-3 cursor-pointer hover:bg-[#D6F32F]/20"
                      onClick={() => requestSort('date')}
                    >
                      <div className="flex items-center">
                        Date
                        {sortConfig.key === 'date' && (
                          sortConfig.direction === 'ascending' 
                            ? <ArrowUp className="ml-2 h-4 w-4" /> 
                            : <ArrowDown className="ml-2 h-4 w-4" />
                        )}
                      </div>
                    </th>
                    <th 
                      className="p-3 cursor-pointer hover:bg-[#D6F32F]/20"
                      onClick={() => requestSort('product')}
                    >
                      <div className="flex items-center">
                        Purchased Product
                        {sortConfig.key === 'product' && (
                          sortConfig.direction === 'ascending' 
                            ? <ArrowUp className="ml-2 h-4 w-4" /> 
                            : <ArrowDown className="ml-2 h-4 w-4" />
                        )}
                      </div>
                    </th>
                    <th 
                      className="p-3 cursor-pointer hover:bg-[#D6F32F]/20"
                      onClick={() => requestSort('eco_score')}
                    >
                      <div className="flex items-center">
                        Eco Score
                        {sortConfig.key === 'eco_score' && (
                          sortConfig.direction === 'ascending' 
                            ? <ArrowUp className="ml-2 h-4 w-4" /> 
                            : <ArrowDown className="ml-2 h-4 w-4" />
                        )}
                      </div>
                    </th>
                    <th>Alternative Product</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedPurchases.map((purchase) => (
                    <tr 
                      key={purchase._id} 
                      className="border-b border-[#151616]/10 hover:bg-[#D6F32F]/10 transition-colors"
                    >
                      <td className="p-3">
                        {new Date(purchase.purchaseDate).toLocaleDateString()}
                      </td>
                      <td className="p-3">
                        {purchase.purchased.product}
                      </td>
                      <td className="p-3">
                        {purchase.purchased.eco_score}
                      </td>
                      <td className="p-3">
                        {purchase.alternative.product}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}