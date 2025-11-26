# SmartServe  
### Can institutional kitchens accurately prepare food without relying on guesswork?

SmartServe is an AI-powered food waste optimization system that predicts surplus, recommends low-waste menu alternatives, and computes optimal portion sizes.  
It is built using **React, FastAPI, Node.js, Supabase**, and ML tools including **Prophet**, **SentenceTransformer**, **PuLP**, and the **Gemini API** for intelligent suggestions.

**Live Demo:** https://smartserveproject.netlify.app/

---

## Overview
Institutional kitchens often overprepare food due to inaccurate forecasting and intuition-based planning.  
SmartServe provides a data-driven solution by combining forecasting, menu analysis, optimization, and LLM-powered insights into a single platform with an admin dashboard, prediction service, and basic ordering app.

---

## Features

### User-Facing (Web + Mobile)
- Browse menu with nutritional information  
- Place real-time food orders  
- Track order status  
- Responsive UI built with React and Flutter  

### Admin / Canteen Panel
- Live order dashboard  
- Daily statistics: completed, pending, total, predicted demand  
- Wastage analytics and item performance  
- Menu management with availability control  
- Automatic demand predictions using historical data  

### AI & Prediction System
- FastAPI ML service for:
  - Demand forecasting (Prophet / Regression models)
  - Menu similarity analysis (SentenceTransformer)
  - Portion optimization (PuLP)
- Gemini API for paragraph-style insights and actionable suggestions  

---

## Problem This Solves

Institutional canteens face challenges such as:

- Overproduction leading to food wastage  
- Underproduction causing shortages  
- No forecasting or data-driven planning  
- No system to track peak hours or popular items  

**SmartServe solves this by providing:**

- Real-time demand visibility  
- Forecast-based planning before cooking begins  
- Reduced wastage and better resource allocation  
- A smooth digital ordering experience  

---

<h3 align="center">Screenshots</h3>

<div style="display: flex; flex-direction: row;">

  <div style="text-align: center;">
    <h4>Admin Dashboard (Web)</h4>
    <img src="https://github.com/user-attachments/assets/987ee219-e1e5-486e-93df-4da00c14828b" 
         alt="web dashboard" width="60%" />
  </div>

  <div style="text-align: center;">
    <h4>Mobile Interface (Flutter)</h4>
    <img src="https://github.com/user-attachments/assets/c9ae9ed9-6315-422e-89d4-ea4ac68c800b" 
         alt="mobile interface" width="20%" />
  </div>

</div>


---

## Tech Stack

### Frontend
- React.js  
- Tailwind CSS  
- ShadCN UI  
- Flutter (basic ordering app)  
- Zustand for state management  

### Backend
- Node.js / Express (API gateway)  
- FastAPI (ML backend)  
- Gemini API for suggestion generation  
- Prophet, SentenceTransformer, PuLP  

### Database
- Supabase (PostgreSQL + Auth)
- Real-time listeners for orders  

### Deployment
- Netlify — frontend  
- Render — Node.js + FastAPI backend  
- Supabase — hosted database  

---

## Key Modules

### 1. Ordering System
- Users place orders via web or Flutter app  
- Orders stored in Supabase  
- Admin receives real-time updates  

### 2. Prediction Service
- FastAPI consumes:
  - Historical orders  
  - Item popularity  
  - Day type (weekday, peak, event days)
- Returns:
  - Predicted demand  
  - Estimated wastage  
  - Suggested portion adjustments  

### 3. Admin Dashboard
- View current-day analytics  
- Track completed vs pending orders  
- Monitor expected demand  
- Access AI-powered suggestions  

---

## Deployment
- **Frontend:** Netlify  
- **Backend APIs:** Render  
- **Database:** Supabase (hosted)

