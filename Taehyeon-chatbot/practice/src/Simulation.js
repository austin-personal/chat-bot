import React, { useState } from "react";
import './Simulation.css'

function Simulation({ messages }) {

    return (
        <>
            <div className="testBox">
                <div>{messages.map((message, index) => (
                    <div key={index}>
                        <p>{message}</p>
                    </div>
                ))}
                </div>
            </div>
        </>
    )
}

export default Simulation;