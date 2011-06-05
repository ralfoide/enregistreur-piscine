using System;
using System.Collections.Generic;
using System.Linq;
using System.Windows.Forms;

using System.Runtime.InteropServices;
using System.Diagnostics;
using System.Reflection;


namespace K8047CsDemoApp {
    static class Program {
        /// <summary>
        /// The main entry point for the application.
        /// </summary>
        [STAThread]
        static void Main() {
            // We can run single instance only here based on Visual Studio
            // Project Settings. So initialize instance to null here.
            Process instance = null;

            // If we are supposed to, check to see if we are the only instance of this
            // program running.
            if (Properties.Settings.Default.StartUsSingleInstanceOnly)
                instance = RunningInstance();

            // If we are the only running instance of this program then continue.
            if (instance == null) {
                Application.EnableVisualStyles();
                Application.SetCompatibleTextRenderingDefault(false);
                Application.Run(new MainForm());
            } else {
                // We are not the only running instance of this program. So do this.
                HandleRunningInstance(instance);
            }
        }

        // Look at all currently runninng processes and see if there is already one of
        // us running with the name of K8047CsDemoApp.exe
        public static Process RunningInstance() {
            Process current = Process.GetCurrentProcess();
            Process[] processes = Process.GetProcessesByName(current.ProcessName);

            foreach (Process process in processes) {
                if (process.Id != current.Id) {
                    if (Assembly.GetExecutingAssembly().Location.Replace("/", "\\") ==
                    current.MainModule.FileName) {
                        // Return the item, not a null.
                        return process;
                    }
                }
            }

            // We did not find another copy of us running.
            return null;
        }

        // Bring to focus the current running process with our name
        // and we will go away without doing anything more.
        public static void HandleRunningInstance(Process instance) {
            ShowWindowAsync(instance.MainWindowHandle, WS_SHOWNORMAL);

            SetForegroundWindow(instance.MainWindowHandle);
        }
        [DllImport("User32.dll")]

        private static extern bool ShowWindowAsync(IntPtr hWnd, int cmdShow);
        [DllImport("User32.dll")]
        private static extern bool
        SetForegroundWindow(IntPtr hWnd);
        private const int WS_SHOWNORMAL = 1;
    }
}
