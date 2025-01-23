import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, Sparkles, Send } from 'lucide-react';
import { motion } from "framer-motion";
import { api } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';

export default function CreatePost() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState<string>('');
  const navigate = useNavigate();
  const { session } = useAuth();

  useEffect(() => {
    if (!session) {
      navigate('/login');
    }
  }, [session, navigate]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const objectUrl = URL.createObjectURL(selectedFile);
      setPreview(objectUrl);
    }
  };

  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!session?.user.id) {
      setError('You must be logged in to create a post');
      return;
    }

    if (!file) {
      setError('Please select an image');
      return;
    }

    try {
      setUploading(true);
      setError('');

      const formData = new FormData();
      formData.append('title', title);
      formData.append('content', content);
      formData.append('image', file);

      await api.createPost(formData);
      navigate('/community');
    } catch (error) {
      setError('Failed to create post. Please try again.');
      console.error('Error:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <section className="py-24 bg-[#ffffff] relative overflow-hidden mt-16">
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(#151616 1px, transparent 1px)`,
            backgroundSize: "24px 24px",
            opacity: "0.1",
          }}
        />
      </div>

      <div className="container mx-auto px-6">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 bg-[#151616] text-white rounded-full px-4 py-2 mb-4"
            >
              <Sparkles className="w-4 h-4 text-[#D6F32F]" />
              <span className="text-sm font-medium">Share Your Eco-Product</span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-4xl font-bold text-[#151616] mb-4"
            >
              Create a New Post
              <span className="inline-block ml-2">🌱</span>
            </motion.h2>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-100 border-2 border-red-400 text-red-700 px-4 py-3 rounded-xl mb-6"
            >
              {error}
            </motion.div>
          )}

          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            onSubmit={handleSubmit}
            className="space-y-6 bg-white rounded-3xl p-8 border-2 border-[#151616] shadow-[4px_4px_0px_0px_#151616]"
          >
            <div>
              <label className="block text-[#151616] font-medium mb-2">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 border-2 border-[#151616] rounded-xl focus:ring-2 focus:ring-[#D6F32F] focus:border-[#151616] transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-[#151616] font-medium mb-2">Content</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full px-4 py-3 border-2 border-[#151616] rounded-xl focus:ring-2 focus:ring-[#D6F32F] focus:border-[#151616] transition-all h-32"
                required
              />
            </div>

            <div>
              <label className="block text-[#151616] font-medium mb-2">Image</label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-[#151616] border-dashed rounded-xl">
                <div className="space-y-1 text-center">
                  {preview ? (
                    <div className="mb-4">
                      <img
                        src={preview}
                        alt="Preview"
                        className="mx-auto h-48 w-auto object-cover rounded-lg"
                      />
                    </div>
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
                        required
                      />
                    </label>
                    <p className="pl-1 pt-2">or drag and drop</p>
                  </div>
                  <p className="text-xs text-[#151616]/70">
                    PNG, JPG, GIF up to 10MB
                  </p>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={uploading}
              className={`w-full bg-[#D6F32F] py-3 rounded-xl font-bold text-[#151616] border-2 border-[#151616] shadow-[4px_4px_0px_0px_#151616] hover:shadow-[2px_2px_0px_0px_#151616] hover:translate-y-[2px] hover:translate-x-[2px] transition-all duration-200 flex items-center justify-center gap-2 ${
                uploading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {uploading ? 'Creating Post...' : 'Create Post'}
              <Send className="w-5 h-5" />
            </button>
          </motion.form>
        </div>
      </div>
    </section>
  );
}