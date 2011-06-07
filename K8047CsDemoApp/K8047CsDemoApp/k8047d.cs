/*
 * Example of Velleman K8047 DLL access in C#.
 * ---------
 * 
 * Project: Enregistreur Piscine
 * Copyright (C) 2011 ralfoide gmail com,
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.InteropServices;


namespace K8047CsDemoApp {
    /// <summary>
    /// Entry points to the K8047d.DLL for C#.
    /// See http://forum.velleman.eu/viewtopic.php?p=3179&sid=858a71e8671645dae76706a940a4a095
    /// </summary>
    class k8047d : IDisposable {

        private bool mStarted = false;
        private bool mLastLedState = false;
        private int[] mChannelVolts = new int[4];
        private double[] mReadVolts = new double[4];
        private int[] mAcqSequence = new int[2];

        public bool Led {
            get {
                return mLastLedState;
            }
            set {
                checkStarted();
                mLastLedState = value;
                if (value) LEDon(); else LEDoff();
            }
        }

        public bool Started {
            get {
                return mStarted;
            }
        }

        public int[] LastSequence {
            get {
                return mAcqSequence;
            }
        }

        public void start() {
            if (!mStarted) {
                StartDevice();
                mStarted = true;
            }
        }

        public void stop() {
            if (mStarted) {
                StopDevice();
                mStarted = false;
            }
        }

        public void Dispose() {
            stop();
        }

        ~k8047d() {
            stop();
        }

        /// <summary>
        /// Sets the gain for each individual channel.
        /// </summary>
        /// <param name="channel">Channel # 0..3</param>
        /// <param name="maxVolts">One of 3V, 6V, 15V or 30V</param>
        public void setChannelGain(int channel, int maxVolts) {
            checkStarted();
            if (channel < 0 || channel > 3) {
                throw new ArgumentException("Invalid channel number " + channel, "channel");
            }

            int divider = 0;
            switch (maxVolts) {
                case 3:
                    divider = 10;
                    break;
                case 6:
                    divider = 5;
                    break;
                case 15:
                    divider = 2;
                    break;
                case 30:
                    divider = 1;
                    break;
                default:
                    throw new ArgumentException("Invalid max volt value for channel", "maxVolts");
            }

            System.Diagnostics.Debug.Assert(divider * maxVolts == 30);
            mChannelVolts[channel] = maxVolts;
            SetGain(channel, divider);
        }

        public double[] read() {
            int[] temp = new int[8];

            ReadData(temp);

            mAcqSequence[0] = temp[0];
            mAcqSequence[1] = temp[1];

            for (int i = 0; i < 4; i++) {
                int b = temp[2 + i];
                mReadVolts[i] = ((double)b / 256.0) * mChannelVolts[i];
            }

            return mReadVolts;
        }

        private void checkStarted() {
            if (!mStarted) {
                throw new InvalidOperationException("K8047d was not started yet");
            }
        }

        //'GENERAL PROCEDURES
        //Private Declare Sub StartDevice Lib "k8047d.dll" ()
        [DllImport("k8047d.dll")]
        private static extern void StartDevice();

        //Private Declare Sub StopDevice Lib "k8047d.dll" ()
        [DllImport("k8047d.dll")]
        private static extern void StopDevice();

        //'INPUT PROCEDURE
        //Private Declare Sub ReadData Lib "k8047d.dll" (Array_Pointer As Long)
        [DllImport("k8047d.dll")]
        private static extern void ReadData([MarshalAs(UnmanagedType.LPArray)]int[] Volts);

        //'OUTPUT PROCEDURE
        //Private Declare Sub SetGain Lib "k8047d.dll" (ByVal Channel_no As Long, ByVal Gain As Long)
        // Gain: 1=30V, 2=15V, 5=6V, 10=3V
        /// <summary>
        /// Set gain for each input.
        /// </summary>
        /// <param name="Channel_no">Channel 0..3</param>
        /// <param name="Gain">Gain: 1=30V, 2=15V, 5=6V, 10=3V</param>
        [DllImport("k8047d.dll")]
        private static extern void SetGain(int Channel_no, int Gain);

        //Private Declare Sub LEDon Lib "k8047d.dll" ()
        [DllImport("k8047d.dll")]
        private static extern void LEDon();
        
        //Private Declare Sub LEDoff Lib "k8047d.dll" ()
        [DllImport("k8047d.dll")]
        private static extern void LEDoff();
    }
}
