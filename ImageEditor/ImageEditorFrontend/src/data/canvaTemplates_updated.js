export const canvaTemplates = [
  // ... other templates remain the same ...
  {
    "title": "Urban Dreams Collection",
    "category": "Social Media", 
    "filename": "urban_dreams_collection.json",
    "json": {
      "version": "5.3.0",
      "objects": [
        {
          "type": "image",
          "left": 0,
          "top": 0,
          "width": 1080,
          "height": 1080,
          "src": "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1080&h=1080&fit=crop",
          "selectable": false
        },
        {
          "type": "rect",
          "left": 0,
          "top": 0,
          "width": 1080,
          "height": 1080,
          "fill": {
            "type": "linear",
            "coords": { "x1": 0, "y1": 0, "x2": 0, "y2": 1080 },
            "colorStops": [
              { "offset": 0, "color": "rgba(138, 43, 226, 0.4)" },
              { "offset": 0.5, "color": "rgba(0, 0, 0, 0.3)" },
              { "offset": 1, "color": "rgba(255, 20, 147, 0.5)" }
            ]
          },
          "selectable": false
        },
        {
          "type": "rect",
          "left": 80,
          "top": 120,
          "width": 920,
          "height": 840,
          "fill": "rgba(0, 0, 0, 0.4)",
          "rx": 30,
          "ry": 30,
          "stroke": "rgba(255, 255, 255, 0.2)",
          "strokeWidth": 2,
          "shadow": {
            "color": "rgba(138, 43, 226, 0.6)",
            "blur": 40,
            "offsetX": 0,
            "offsetY": 0
          }
        },
        {
          "type": "rect",
          "left": 120,
          "top": 180,
          "width": 120,
          "height": 6,
          "fill": "#FF1493",
          "rx": 3,
          "ry": 3
        },
        {
          "type": "textbox",
          "left": 120,
          "top": 220,
          "width": 840,
          "text": "DISCOVER",
          "fontSize": 72,
          "fontFamily": "Montserrat",
          "fontWeight": "900",
          "fill": "#FFFFFF",
          "textAlign": "left",
          "lineHeight": 1.1,
          "shadow": {
            "color": "rgba(255, 20, 147, 0.8)",
            "blur": 25,
            "offsetX": 0,
            "offsetY": 0
          }
        },
        {
          "type": "textbox",
          "left": 120,
          "top": 310,
          "width": 840,
          "text": "THE EXTRAORDINARY",
          "fontSize": 72,
          "fontFamily": "Montserrat",
          "fontWeight": "900",
          "fill": {
            "type": "linear",
            "coords": { "x1": 0, "y1": 0, "x2": 840, "y2": 0 },
            "colorStops": [
              { "offset": 0, "color": "#FF1493" },
              { "offset": 0.5, "color": "#8A2BE2" },
              { "offset": 1, "color": "#00CED1" }
            ]
          },
          "textAlign": "left",
          "lineHeight": 1.1,
          "shadow": {
            "color": "rgba(138, 43, 226, 0.8)",
            "blur": 25,
            "offsetX": 0,
            "offsetY": 0
          }
        },
        {
          "type": "textbox",
          "left": 120,
          "top": 480,
          "width": 840,
          "text": "Explore new horizons and embrace the journey ahead. Every moment is an opportunity to create something beautiful.",
          "fontSize": 24,
          "fontFamily": "Inter",
          "fontWeight": "400",
          "fill": "#E0E0E0",
          "textAlign": "left",
          "lineHeight": 1.6,
          "opacity": 0.95
        },
        {
          "type": "rect",
          "left": 120,
          "top": 680,
          "width": 280,
          "height": 70,
          "fill": {
            "type": "linear",
            "coords": { "x1": 0, "y1": 0, "x2": 280, "y2": 0 },
            "colorStops": [
              { "offset": 0, "color": "#FF1493" },
              { "offset": 1, "color": "#8A2BE2" }
            ]
          },
          "rx": 35,
          "ry": 35,
          "shadow": {
            "color": "rgba(255, 20, 147, 0.5)",
            "blur": 20,
            "offsetX": 0,
            "offsetY": 5
          }
        },
        {
          "type": "textbox",
          "left": 120,
          "top": 693,
          "width": 280,
          "text": "LEARN MORE",
          "fontSize": 20,
          "fontFamily": "Montserrat",
          "fontWeight": "700",
          "fill": "#FFFFFF",
          "textAlign": "center",
          "letterSpacing": 100
        },
        {
          "type": "circle",
          "left": 850,
          "top": 700,
          "radius": 80,
          "fill": "rgba(255, 255, 255, 0.1)",
          "stroke": "rgba(255, 20, 147, 0.6)",
          "strokeWidth": 3,
          "opacity": 0.6
        },
        {
          "type": "circle",
          "left": 780,
          "top": 630,
          "radius": 50,
          "fill": "rgba(138, 43, 226, 0.15)",
          "stroke": "rgba(0, 206, 209, 0.5)",
          "strokeWidth": 2,
          "opacity": 0.7
        },
        {
          "type": "textbox",
          "left": 120,
          "top": 870,
          "width": 840,
          "text": "@YourBrand · www.yourwebsite.com",
          "fontSize": 18,
          "fontFamily": "Inter",
          "fontWeight": "500",
          "fill": "#FFFFFF",
          "textAlign": "center",
          "opacity": 0.8
        }
      ]
    }
  }
  // ... other templates
];