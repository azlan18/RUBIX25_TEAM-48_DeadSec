import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Upload, CheckCircle, ShoppingCart, Send } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';

interface ProductComparison {
    better_alternative_product: {
        eco_score: string;
        product: string;
        carbon_footprint: string;
        water_usage: string;
        waste_generated?: string;
    };
    product_searched: {
        eco_score: string;
        product: string;
        carbon_footprint: string;
        water_usage: string;
        waste_generated?: string;
    };
}

export default function ProductComparisonUI() {
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string>('');
    const [comparisonData, setComparisonData] = useState<ProductComparison | null>(null);
    const [loading, setLoading] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            const objectUrl = URL.createObjectURL(selectedFile);
            setPreview(objectUrl);
        }
    };

    const handleRetake = () => {
        setFile(null);
        setPreview('');
        setComparisonData(null);
    };

    const handleSubmit = async () => {
        if (!file) {
            toast.error('Please upload an image');
            return;
        }

        setLoading(true);
        toast('Processing your request...');

        const formData = new FormData();
        formData.append('productImage', file);

        try {
            const response = await axios.post('http://localhost:3000/upload-product', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            console.log('Full API Response:', response.data);
            setComparisonData(response.data);
            setLoading(false);
            toast.success('Comparison data loaded!');
        } catch (error) {
            console.error('Error uploading product:', error);
            setLoading(false);
            toast.error('Failed to process image. Please try again.');
        }
    };

    const handlePurchase = (productName: string) => {
        toast.success(`Purchase completed for ${productName}`, {
            duration: 4000,
            style: {
                border: '1px solid #151616',
                padding: '16px',
                color: '#151616',
                backgroundColor: '#D6F32F',
                fontWeight: 'bold',
            },
        });
    };

    return (
        <section className="py-24 bg-[#ffffff] relative overflow-hidden mt-16">
            <Toaster position="top-right" />
            <div className="container mx-auto px-6">
                <div className="max-w-2xl mx-auto">
                    <div className="text-center mb-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="inline-flex items-center gap-2 bg-[#151616] text-white rounded-full px-4 py-2 mb-4"
                        >
                            <Upload className="w-4 h-4 text-[#D6F32F]" />
                            <span className="text-sm font-medium">Upload Product Label</span>
                        </motion.div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-3xl p-8 border-2 border-[#151616] shadow-[4px_4px_0px_0px_#151616] space-y-6"
                    >
                        <div>
                            <label className="block text-[#151616] font-medium mb-2">Image</label>
                            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-[#151616] border-dashed rounded-xl">
                                <div className="space-y-1 text-center">
                                    {preview ? (
                                        <img
                                            src={preview}
                                            alt="Preview"
                                            className="mx-auto h-48 w-auto object-cover rounded-lg mb-4"
                                        />
                                    ) : (
                                        <Upload className="mx-auto h-12 w-12 text-[#151616]/40" />
                                    )}
                                    <div className="flex text-sm text-[#151616]">
                                        <label
                                            htmlFor="file-upload"
                                            className="relative cursor-pointer bg-[#D6F32F] rounded-lg px-4 py-2 border-2 border-[#151616] shadow-[2px_2px_0px_0px_#151616] hover:shadow-[1px_1px_0px_0px_#151616] hover:translate-y-[1px] hover:translate-x-[1px] transition-all"
                                        >
                                            <span>Upload a file</span>
                                            <input
                                                id="file-upload"
                                                name="file-upload"
                                                type="file"
                                                className="sr-only"
                                                accept="image/*"
                                                onChange={handleFileChange}
                                            />
                                        </label>
                                        <p className="pl-1 pt-2">or drag and drop</p>
                                    </div>
                                    <p className="text-xs text-[#151616]/70">PNG, JPG, up to 10MB</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-between">
                            <button
                                onClick={handleSubmit}
                                disabled={loading || !file}
                                className={`bg-[#D6F32F] py-3 px-6 rounded-xl font-bold text-[#151616] border-2 border-[#151616] shadow-[4px_4px_0px_0px_#151616] hover:shadow-[2px_2px_0px_0px_#151616] hover:translate-y-[2px] hover:translate-x-[2px] transition-all ${loading || !file ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                {loading ? 'Processing...' : 'Submit'}
                            </button>
                            {preview && (
                                <button
                                    onClick={handleRetake}
                                    className="bg-[#ffffff] py-3 px-6 rounded-xl font-bold text-[#151616] border-2 border-[#151616] shadow-[4px_4px_0px_0px_#151616] hover:shadow-[2px_2px_0px_0px_#151616] hover:translate-y-[2px] hover:translate-x-[2px] transition-all"
                                >
                                    Retake
                                </button>
                            )}
                        </div>
                    </motion.div>

                    {comparisonData && (
                        <div className="mt-8 grid gap-8 md:grid-cols-2">
                            {[comparisonData.product_searched, comparisonData.better_alternative_product].map((product, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-white rounded-3xl p-6 border-2 border-[#151616] shadow-[4px_4px_0px_0px_#151616]"
                                >
                                    <h3 className="text-lg font-bold text-[#151616] mb-2">{product.product}</h3>
                                    <p className="text-sm text-[#151616]/70 mb-2">Eco Score: <span className="font-bold text-[#151616]">{product.eco_score}</span></p>
                                    <p className="text-sm text-[#151616]/70 mb-2">Carbon Footprint: <span className="font-bold text-[#151616]">{product.carbon_footprint}</span></p>
                                    <p className="text-sm text-[#151616]/70 mb-2">Water Usage: <span className="font-bold text-[#151616]">{product.water_usage}</span></p>
                                    {product.waste_generated && (
                                        <p className="text-sm text-[#151616]/70 mb-4">Waste Generated: <span className="font-bold text-[#151616]">{product.waste_generated}</span></p>
                                    )}
                                    <button
                                        onClick={() => handlePurchase(product.product)}
                                        className="bg-[#D6F32F] px-4 py-2 rounded-md font-medium text-[#151616] border-2 border-[#151616] shadow-[4px_4px_0px_0px_#151616] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[2px_2px_0px_0px_#151616] transition-all"
                                    >
                                        Purchase
                                    </button>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}