import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { coursesAPI } from '../../services/api';
import Input from '../../components/Common/Input';
import Button from '../../components/Common/Button';
import Card from '../../components/Common/Card';
import toast from 'react-hot-toast';

const CreateCourse = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    level: 'débutant',
    category: ''
  });
  
  // NOUVEAUX ÉTATS pour gérer l'image
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const categories = [
    'Développement', 'Marketing', 'Design', 'Bureautique', 
    'Langues', 'Soft Skills', 'Data Science', 'Business'
  ];

  const levels = ['débutant', 'intermédiaire', 'avancé'];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // NOUVELLE FONCTION pour gérer le changement de fichier image
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    
    if (file) {
      // Vérifier que c'est une image
      if (!file.type.startsWith('image/')) {
        toast.error('Veuillez sélectionner un fichier image valide');
        return;
      }
      
      // Vérifier la taille (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('L\'image ne doit pas dépasser 5MB');
        return;
      }
      
      setImageFile(file);
      
      // Créer un aperçu de l'image
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // FONCTION MODIFIÉE pour supprimer l'image
  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  // FONCTION SUBMIT MODIFIÉE pour envoyer FormData
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Vérifier qu'une image a été sélectionnée
    if (!imageFile) {
      toast.error('Veuillez sélectionner une image pour le cours');
      return;
    }
    
    setLoading(true);

    try {
      // Créer un FormData au lieu d'un objet JSON
      const data = new FormData();
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('level', formData.level);
      data.append('category', formData.category);
      data.append('image', imageFile); // Ajouter le fichier image

      const response = await coursesAPI.create(data);
      toast.success('Cours créé avec succès !');
      navigate(`/trainer/courses/${response.data.courseId}`);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Erreur lors de la création du cours');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Créer un nouveau cours</h1>
          <p className="text-gray-600 mt-1">Remplissez les informations de base du cours</p>
        </div>

        <Card>
          <form onSubmit={handleSubmit}>
            <Input
              label="Titre du cours"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Ex: Développement Web Full Stack"
              required
            />

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Décrivez votre cours..."
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Niveau
                </label>
                <select
                  name="level"
                  value={formData.level}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                >
                  {levels.map(level => (
                    <option key={level} value={level}>
                      {level.charAt(0).toUpperCase() + level.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Catégorie
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                >
                  <option value="">Sélectionnez une catégorie</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* SECTION IMAGE MODIFIÉE - Upload de fichier */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Image du cours <span className="text-red-500">*</span>
              </label>
              
              {!imagePreview ? (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-500 transition">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    id="image-upload"
                  />
                  <label 
                    htmlFor="image-upload" 
                    className="cursor-pointer"
                  >
                    <div className="flex flex-col items-center">
                      <svg 
                        className="w-12 h-12 text-gray-400 mb-3" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2} 
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
                        />
                      </svg>
                      <p className="text-sm text-gray-600 mb-1">
                        Cliquez pour télécharger une image
                      </p>
                      <p className="text-xs text-gray-500">
                        PNG, JPG, GIF jusqu'à 5MB
                      </p>
                    </div>
                  </label>
                </div>
              ) : (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Aperçu du cours"
                    className="w-full h-64 object-cover rounded-lg border border-gray-300"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition shadow-lg"
                  >
                    <svg 
                      className="w-5 h-5" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M6 18L18 6M6 6l12 12" 
                      />
                    </svg>
                  </button>
                  <div className="mt-2 text-sm text-gray-600">
                    <p>📁 {imageFile?.name}</p>
                    <p>📊 {(imageFile?.size / 1024).toFixed(2)} KB</p>
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/trainer/dashboard')}
              >
                Annuler
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={loading || !imageFile}
              >
                {loading ? 'Création...' : 'Créer le cours'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default CreateCourse;
