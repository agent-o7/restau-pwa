import React, { useState } from 'react';
import { ArrowLeft, MapPin, Navigation, Loader } from 'lucide-react';
import { CartItem } from '../types';

interface TableSelectionViewProps {
  cart: CartItem[];
  onBack: () => void;
  onConfirmTable: (tableNumber: number) => void;
}

export default function TableSelectionView({ cart, onBack, onConfirmTable }: TableSelectionViewProps) {
  const [tableNumber, setTableNumber] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isGettingLocation, setIsGettingLocation] = useState<boolean>(false);
  const [locationError, setLocationError] = useState<string>('');

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0
    }).format(price);
  };

  const generateWhatsAppMessage = (tableNum: number) => {
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    
    let message = `🍽️ *Nouvelle Commande - AfricaEats*\n\n`;
    message += `📍 *Numéro de Table :* ${tableNum}\n\n`;
    message += `📋 *Détails de la Commande :*\n`;
    
    cart.forEach((item, index) => {
      message += `${index + 1}. ${item.name}\n`;
      message += `   Quantité : ${item.quantity}\n`;
      message += `   Prix : ${formatPrice(item.price * item.quantity)}\n\n`;
    });
    
    message += `💰 *Montant Total : ${formatPrice(total)}*\n\n`;
    message += `⏰ Commande passée le : ${new Date().toLocaleString('fr-FR')}\n\n`;
    message += `Merci d'avoir choisi AfricaEats ! 🙏`;
    
    return encodeURIComponent(message);
  };

  const generateWhatsAppMessageWithLocation = (latitude: number, longitude: number) => {
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    
    let message = `🍽️ *Nouvelle Commande à Distance - AfricaEats*\n\n`;
    message += `📍 *Localisation du Client :*\n`;
    message += `https://maps.google.com/?q=${latitude},${longitude}\n\n`;
    message += `📋 *Détails de la Commande :*\n`;
    
    cart.forEach((item, index) => {
      message += `${index + 1}. ${item.name}\n`;
      message += `   Quantité : ${item.quantity}\n`;
      message += `   Prix : ${formatPrice(item.price * item.quantity)}\n\n`;
    });
    
    message += `💰 *Montant Total : ${formatPrice(total)}*\n\n`;
    message += `⏰ Commande passée le : ${new Date().toLocaleString('fr-FR')}\n\n`;
    message += `🚚 *Commande à livrer à l'adresse indiquée sur la carte*\n\n`;
    message += `Merci d'avoir choisi AfricaEats ! 🙏`;
    
    return encodeURIComponent(message);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const num = parseInt(tableNumber);
    if (!tableNumber || isNaN(num) || num < 1 || num > 50) {
      setError('Veuillez entrer un numéro de table valide (1-50)');
      return;
    }

    setError('');
    
    // Generate WhatsApp message
    const whatsappMessage = generateWhatsAppMessage(num);
    
    // Restaurant's WhatsApp number (replace with actual number)
    const restaurantWhatsApp = '22879689386'; // Replace with restaurant's actual WhatsApp number
    
    // Create WhatsApp URL
    const whatsappUrl = `https://wa.me/${restaurantWhatsApp}?text=${whatsappMessage}`;
    
    // Open WhatsApp
    window.open(whatsappUrl, '_blank');
    
    // Call the original confirmation handler
    onConfirmTable(num);
  };

  const handleRemoteOrder = () => {
    setIsGettingLocation(true);
    setLocationError('');

    if (!navigator.geolocation) {
      setLocationError('La géolocalisation n\'est pas supportée par votre navigateur');
      setIsGettingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        
        // Generate WhatsApp message with location
        const whatsappMessage = generateWhatsAppMessageWithLocation(latitude, longitude);
        
        // Restaurant's WhatsApp number
        const restaurantWhatsApp = '22879689386';
        
        // Create WhatsApp URL
        const whatsappUrl = `https://wa.me/${restaurantWhatsApp}?text=${whatsappMessage}`;
        
        // Open WhatsApp
        window.open(whatsappUrl, '_blank');
        
        setIsGettingLocation(false);
        
        // Create a mock order for confirmation (without table number)
        const order = {
          items: cart,
          tableNumber: 0, // 0 indicates remote order
          total: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
          timestamp: new Date()
        };
        
        onConfirmTable(0); // Pass 0 to indicate remote order
      },
      (error) => {
        let errorMessage = 'Erreur lors de l\'obtention de la localisation';
        
        switch(error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Autorisation de localisation refusée. Veuillez autoriser l\'accès à votre position.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Informations de localisation non disponibles.';
            break;
          case error.TIMEOUT:
            errorMessage = 'Délai d\'attente dépassé pour obtenir la localisation.';
            break;
        }
        
        setLocationError(errorMessage);
        setIsGettingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center">
            <button
              onClick={onBack}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </button>
            <h1 className="text-lg font-semibold text-gray-900 ml-2">Sélectionnez Votre Table</h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-md mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="text-center mb-6">
            <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="h-8 w-8 text-orange-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              À quelle table êtes-vous ?
            </h2>
            <p className="text-gray-600">
              Entrez votre numéro de table et nous enverrons votre commande au restaurant via WhatsApp.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="tableNumber" className="block text-sm font-medium text-gray-700 mb-2">
                Numéro de Table
              </label>
              <input
                type="number"
                id="tableNumber"
                value={tableNumber}
                onChange={(e) => {
                  setTableNumber(e.target.value);
                  setError('');
                }}
                placeholder="Entrez le numéro de table (1-50)"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-center text-2xl font-semibold"
                min="1"
                max="50"
              />
              {error && (
                <p className="text-red-600 text-sm mt-2">{error}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-green-600 text-white font-semibold py-3 px-4 rounded-xl hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
            >
              <span>📱</span>
              <span>Envoyer la Commande via WhatsApp</span>
            </button>
          </form>

          <div className="mt-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">ou</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleRemoteOrder}
            disabled={isGettingLocation}
            className="w-full mt-4 bg-blue-600 text-white font-semibold py-3 px-4 rounded-xl hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
          >
            {isGettingLocation ? (
              <>
                <Loader className="h-5 w-5 animate-spin" />
                <span>Obtention de la localisation...</span>
              </>
            ) : (
              <>
                <Navigation className="h-5 w-5" />
                <span>Commander à Distance</span>
              </>
            )}
          </button>

          {locationError && (
            <div className="mt-4 p-4 bg-red-50 rounded-lg border border-red-200">
              <p className="text-sm text-red-800">{locationError}</p>
            </div>
          )}

          <div className="mt-6 p-4 bg-green-50 rounded-lg">
            <p className="text-sm text-green-800">
              <strong>Comment ça marche :</strong> Après avoir cliqué sur le bouton, WhatsApp s'ouvrira avec les détails de votre commande pré-remplis. Il vous suffit d'envoyer le message pour passer votre commande !
            </p>
          </div>

          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Commande à distance :</strong> Cliquez sur "Commander à Distance" pour partager votre localisation et recevoir votre commande où vous êtes !
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
