'use client';

import { useState } from 'react';
import Navigation from '@/components/Navigation';
import { diagnosisAPI } from '@/lib/api';
import { useForm } from 'react-hook-form';
import { Stethoscope, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';

interface DiagnosisForm {
  symptoms: string;
  age: number;
  gender: string;
  medicalHistory: string;
  currentMedications: string;
}

interface DiagnosisResult {
  id: string;
  diagnosis: string;
  confidence: number;
  recommendations: string[];
  severity: 'low' | 'medium' | 'high';
}

export default function DiagnosisPage() {
  const [result, setResult] = useState<DiagnosisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const { register, handleSubmit, formState: { errors } } = useForm<DiagnosisForm>();

  const onSubmit = async (data: DiagnosisForm) => {
    setIsLoading(true);
    try {
      const response = await diagnosisAPI.create(data);
      
      // Mock result for demonstration
      const mockResult: DiagnosisResult = {
        id: Date.now().toString(),
        diagnosis: 'Based on the symptoms provided, possible conditions may include common cold, flu, or viral infection.',
        confidence: 85,
        recommendations: [
          'Get plenty of rest',
          'Stay hydrated with fluids',
          'Consider over-the-counter pain relievers if needed',
          'Monitor symptoms and seek medical attention if they worsen',
          'Isolate from others if contagious symptoms present'
        ],
        severity: 'low'
      };
      
      setResult(mockResult);
    } catch (error) {
      console.error('Error getting diagnosis:', error);
      alert('Error getting diagnosis. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'high': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">AI Diagnosis Assistant</h1>
          <p className="mt-2 text-gray-600">Get preliminary medical insights based on your symptoms</p>
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-yellow-400 mr-2 mt-0.5" />
              <div>
                <p className="text-sm text-yellow-800">
                  <strong>Disclaimer:</strong> This tool provides preliminary insights only and should not replace professional medical advice. 
                  Always consult with a healthcare professional for proper diagnosis and treatment.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Symptom Information</h2>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label htmlFor="symptoms" className="block text-sm font-medium text-gray-700 mb-2">
                  Describe your symptoms *
                </label>
                <textarea
                  {...register('symptoms', { required: 'Please describe your symptoms' })}
                  rows={4}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Describe your symptoms in detail (e.g., fever, headache, cough, duration, etc.)"
                />
                {errors.symptoms && (
                  <p className="mt-1 text-sm text-red-600">{errors.symptoms.message}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-2">
                    Age *
                  </label>
                  <input
                    type="number"
                    {...register('age', { required: 'Age is required', min: 0, max: 150 })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="25"
                  />
                  {errors.age && (
                    <p className="mt-1 text-sm text-red-600">{errors.age.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-2">
                    Gender *
                  </label>
                  <select
                    {...register('gender', { required: 'Please select gender' })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                  {errors.gender && (
                    <p className="mt-1 text-sm text-red-600">{errors.gender.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="medicalHistory" className="block text-sm font-medium text-gray-700 mb-2">
                  Medical History
                </label>
                <textarea
                  {...register('medicalHistory')}
                  rows={3}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Any relevant medical history, allergies, or chronic conditions"
                />
              </div>

              <div>
                <label htmlFor="currentMedications" className="block text-sm font-medium text-gray-700 mb-2">
                  Current Medications
                </label>
                <textarea
                  {...register('currentMedications')}
                  rows={2}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="List any medications you're currently taking"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Stethoscope className="h-4 w-4 mr-2" />
                    Get Diagnosis
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Results */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Diagnosis Results</h2>
            
            {!result ? (
              <div className="text-center py-8">
                <Stethoscope className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Fill out the form to get your diagnosis</p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Confidence Score */}
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                  <span className="text-sm font-medium text-blue-900">Confidence Score</span>
                  <span className="text-lg font-bold text-blue-600">{result.confidence}%</span>
                </div>

                {/* Severity */}
                <div className="flex items-center justify-between p-4 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">Severity Level</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getSeverityColor(result.severity)}`}>
                    {result.severity.charAt(0).toUpperCase() + result.severity.slice(1)}
                  </span>
                </div>

                {/* Diagnosis */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Preliminary Assessment</h3>
                  <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">{result.diagnosis}</p>
                </div>

                {/* Recommendations */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Recommendations</h3>
                  <ul className="space-y-2">
                    {result.recommendations.map((rec, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-md">
                  <div className="flex">
                    <AlertCircle className="h-5 w-5 text-red-400 mr-2 mt-0.5" />
                    <div>
                      <p className="text-sm text-red-800">
                        <strong>Important:</strong> This is a preliminary assessment. Please consult with a healthcare professional for proper diagnosis and treatment, especially if symptoms persist or worsen.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
