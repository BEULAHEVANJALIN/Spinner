use wasm_bindgen::prelude::*;
use web_sys::{js_sys};

#[wasm_bindgen]
pub struct Spinner {
    names: Vec<String>,
    rotation: f64,
    velocity: f64,
}

#[wasm_bindgen]
impl Spinner {
    #[wasm_bindgen(constructor)]
    pub fn new(js_names: Vec<JsValue>) -> Spinner {
        let names = js_names.into_iter()
            .map(|v| v.as_string().unwrap())
            .collect();
        Spinner { names, rotation: 0.0, velocity: 0.0 }
    }

    pub fn start(&mut self) {
        self.velocity = 0.5 + js_sys::Math::random() * 0.5;
    }

    pub fn update(&mut self) -> f64 {
        self.rotation += self.velocity;
        self.velocity *= 0.99;
        self.velocity
    }

    pub fn rotation(&self) -> f64 {
        self.rotation
    }

    pub fn velocity(&self) -> f64 {
        self.velocity
    }

    pub fn winner(&self) -> String {
        let two_pi = std::f64::consts::PI * 2.0;
        let angle = self.rotation.rem_euclid(two_pi);
        let idx = ((angle / two_pi) * self.names.len() as f64).floor() as usize;
        self.names[idx].clone()
    }
}
