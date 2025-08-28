import React from 'react';
import { CheckCircle, Clock, MapPin, ArrowLeft, MessageCircle } from 'lucide-react';
import { Order } from '../types';

interface OrderConfirmationViewProps {
  order: Order;
  onBackToMenu: () => void;
}

export default function OrderConfirmationView({ order, onBackToMenu }: OrderConfirmationViewProps) {
  const isRemoteOrder = order.tableNumber === 0;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0
    }).format(price);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center">
            <button
              onClick={onBackToMenu}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </button>
            <h1 className="text-lg font-semibold text-gray-900 ml-2">Commande Envoyée</h1>
          </div>
        </div>
      </div>

      {/* Success Message */}
      <div className="max-w-md mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center mb-6">
          <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageCircle className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Commande Envoyée via WhatsApp !
          </h2>
          <p className="text-gray-600 mb-4">
            {isRemoteOrder 
              ? "Votre commande à distance a été envoyée au restaurant via WhatsApp avec votre localisation. Ils vont la préparer et la livrer !"
              : "Votre commande a été envoyée au restaurant via WhatsApp. Ils vont la préparer fraîchement pour vous !"
            }
          </p>
          <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span>Commandé à {formatTime(order.timestamp)}</span>
            </div>
            {!isRemoteOrder && (
              <div className="flex items-center space-x-1">
                <MapPin className="h-4 w-4" />
                <span>Table {order.tableNumber}</span>
              </div>
            )}
            {isRemoteOrder && (
              <div className="flex items-center space-x-1">
                <Navigation className="h-4 w-4" />
                <span>Livraison</span>
              </div>
            )}
          </div>
        </div>

        {/* Order Details */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Détails de la Commande</h3>
          <div className="space-y-3">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center space-x-3">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-12 h-12 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{item.name}</h4>
                  <p className="text-sm text-gray-600">Quantité : {item.quantity}</p>
                </div>
                <span className="font-semibold text-gray-900">
                  {formatPrice(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>
          
          <hr className="my-4" />
          
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold text-gray-900">Total</span>
            <span className="text-xl font-bold text-orange-600">
              {formatPrice(order.total)}
            </span>
          </div>
        </div>

        {/* Status Info */}
        <div className={`rounded-xl p-4 mt-6 border ${isRemoteOrder ? 'bg-blue-50 border-blue-200' : 'bg-green-50 border-green-200'}`}>
          <div className="flex items-center space-x-2">
            <MessageCircle className={`h-5 w-5 ${isRemoteOrder ? 'text-blue-600' : 'text-green-600'}`} />
            <div>
              <p className={`font-medium ${isRemoteOrder ? 'text-blue-900' : 'text-green-900'}`}>
                {isRemoteOrder ? 'Commande à distance envoyée' : 'Commande envoyée avec succès'}
              </p>
              <p className={`text-sm ${isRemoteOrder ? 'text-blue-700' : 'text-green-700'}`}>
                {isRemoteOrder 
                  ? 'Le restaurant a reçu votre localisation et préparera votre livraison'
                  : 'Le restaurant confirmera votre commande sous peu'
                }
              </p>
            </div>
          </div>
        </div>

        {/* Estimated Time */}
        <div className="bg-orange-50 rounded-xl p-4 mt-4 border border-orange-200">
          <div className="flex items-center space-x-2">
            <Clock className="h-5 w-5 text-orange-600" />
            <div>
              <p className="font-medium text-orange-900">Temps de préparation estimé</p>
              <p className="text-sm text-orange-700">
                {isRemoteOrder ? '25-40 minutes (incluant livraison)' : '15-25 minutes'}
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 space-y-3">
          <button
            onClick={onBackToMenu}
            className="w-full bg-orange-600 text-white font-semibold py-3 px-4 rounded-xl hover:bg-orange-700 transition-colors"
          >
            Commander Plus d'Articles
          </button>
          <p className="text-center text-sm text-gray-500">
            Besoin d'aide ? Le restaurant vous contactera via WhatsApp si nécessaire
          </p>
        </div>
      </div>
    </div>
  );
}