VERSION 5.00
Begin VB.Form FormMain 
   Caption         =   "Enregistreur Piscine"
   ClientHeight    =   5520
   ClientLeft      =   1485
   ClientTop       =   1875
   ClientWidth     =   9795
   Icon            =   "EcranEnregistreur.frx":0000
   LinkTopic       =   "Form1"
   ScaleHeight     =   5520
   ScaleWidth      =   9795
   Begin VB.CheckBox CheckSimulation 
      Caption         =   "Simulation"
      Height          =   255
      Left            =   8280
      TabIndex        =   24
      Top             =   3840
      Width           =   1215
   End
   Begin VB.PictureBox PictureYesterday 
      BackColor       =   &H00E0E0E0&
      BorderStyle     =   0  'None
      Height          =   1215
      Left            =   120
      ScaleHeight     =   81
      ScaleMode       =   3  'Pixel
      ScaleWidth      =   633
      TabIndex        =   14
      Top             =   1920
      Width           =   9495
   End
   Begin VB.Frame Frame2 
      Caption         =   "Paramètres"
      Height          =   1215
      Left            =   240
      TabIndex        =   9
      Top             =   4200
      Width           =   4575
      Begin VB.ComboBox ComboCanal 
         Height          =   315
         ItemData        =   "EcranEnregistreur.frx":030A
         Left            =   1320
         List            =   "EcranEnregistreur.frx":031A
         Style           =   2  'Dropdown List
         TabIndex        =   10
         Top             =   360
         Width           =   1335
      End
      Begin VB.Label Label9 
         Caption         =   "Enregistrer sur"
         Height          =   255
         Left            =   120
         TabIndex        =   11
         Top             =   360
         Width           =   1215
      End
   End
   Begin VB.Timer Timer1 
      Interval        =   60000
      Left            =   7680
      Top             =   3480
   End
   Begin VB.CommandButton BtnStop 
      Caption         =   "Arrêter"
      Height          =   495
      Left            =   1920
      TabIndex        =   8
      Top             =   3480
      Width           =   1455
   End
   Begin VB.Frame Frame1 
      Caption         =   "Dernière Données Enregistreur"
      Height          =   1215
      Left            =   5040
      TabIndex        =   3
      Top             =   4200
      Width           =   4695
      Begin VB.TextBox TextVolt 
         Height          =   285
         Index           =   1
         Left            =   2040
         TabIndex        =   22
         Top             =   840
         Width           =   735
      End
      Begin VB.TextBox TextVolt 
         Height          =   285
         Index           =   0
         Left            =   1080
         TabIndex        =   21
         Top             =   840
         Width           =   735
      End
      Begin VB.TextBox TextVolt 
         Height          =   285
         Index           =   3
         Left            =   3720
         TabIndex        =   20
         Top             =   840
         Width           =   735
      End
      Begin VB.TextBox TextVolt 
         Height          =   285
         Index           =   2
         Left            =   2880
         TabIndex        =   19
         Top             =   840
         Width           =   735
      End
      Begin VB.TextBox TextLoggerIndex 
         Height          =   285
         Left            =   240
         TabIndex        =   17
         Top             =   840
         Width           =   735
      End
      Begin VB.Label LabelTime 
         Caption         =   "(heure)"
         Height          =   255
         Left            =   600
         TabIndex        =   23
         Top             =   240
         Width           =   2655
      End
      Begin VB.Label Label36 
         Caption         =   "Index"
         Height          =   255
         Left            =   240
         TabIndex        =   18
         Top             =   600
         Width           =   735
      End
      Begin VB.Label Label4 
         Caption         =   "CH1"
         Height          =   195
         Left            =   1320
         TabIndex        =   7
         Top             =   600
         Width           =   375
      End
      Begin VB.Label Label5 
         Caption         =   "CH2"
         Height          =   195
         Left            =   2160
         TabIndex        =   6
         Top             =   600
         Width           =   375
      End
      Begin VB.Label Label6 
         Caption         =   "CH3"
         Height          =   195
         Left            =   3000
         TabIndex        =   5
         Top             =   600
         Width           =   375
      End
      Begin VB.Label Label7 
         Caption         =   "CH4"
         Height          =   195
         Left            =   3840
         TabIndex        =   4
         Top             =   600
         Width           =   375
      End
   End
   Begin VB.PictureBox PictureToday 
      BackColor       =   &H00FFFFFF&
      BorderStyle     =   0  'None
      Height          =   1215
      Left            =   120
      ScaleHeight     =   81
      ScaleMode       =   3  'Pixel
      ScaleWidth      =   633
      TabIndex        =   2
      Top             =   360
      Width           =   9495
   End
   Begin VB.CheckBox CheckLED 
      Caption         =   "Allumer LED"
      Height          =   375
      Left            =   8280
      TabIndex        =   1
      Top             =   3480
      Width           =   1335
   End
   Begin VB.CommandButton BtnStart 
      Caption         =   "Démarrer"
      Height          =   495
      Left            =   240
      TabIndex        =   0
      Top             =   3480
      Width           =   1455
   End
   Begin VB.Label Label12 
      Alignment       =   2  'Center
      Caption         =   "Hier"
      Height          =   255
      Left            =   360
      TabIndex        =   16
      Top             =   1680
      Width           =   495
   End
   Begin VB.Line Line1 
      X1              =   120
      X2              =   9600
      Y1              =   1800
      Y2              =   1800
   End
   Begin VB.Label Label11 
      Caption         =   "Aujourd'hui"
      Height          =   255
      Left            =   240
      TabIndex        =   15
      Top             =   120
      Width           =   1815
   End
   Begin VB.Label LabelStatus 
      Caption         =   "(status)"
      Height          =   255
      Left            =   4080
      TabIndex        =   13
      Top             =   3600
      Width           =   3255
   End
   Begin VB.Label Label10 
      Caption         =   "Etat:"
      Height          =   255
      Left            =   3480
      TabIndex        =   12
      Top             =   3600
      Width           =   495
   End
End
Attribute VB_Name = "FormMain"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = False
Attribute VB_PredeclaredId = True
Attribute VB_Exposed = False
Option Explicit
Option Base 0

'Declare use of the DLL
'K8047D.DLL interface

'GENERAL PROCEDURES
Private Declare Sub StartDevice Lib "k8047d.dll" ()
Private Declare Sub StopDevice Lib "k8047d.dll" ()

'INPUT PROCEDURE
Private Declare Sub ReadData Lib "k8047d.dll" (Array_Pointer As Long)

'OUTPUT PROCEDURE
Private Declare Sub SetGain Lib "k8047d.dll" (ByVal Channel_no As Long, ByVal Gain As Long)
Private Declare Sub LEDon Lib "k8047d.dll" ()
Private Declare Sub LEDoff Lib "k8047d.dll" ()

'Declare variables
Dim Simulation As Boolean
Dim DataBuffer(7) As Long

'1 Day = 60*24=1440 minutes
Const DataSize As Integer = 1440
Const DataGain As Integer = 2
Const DataVoltCoef As Double = 30 / DataGain / 255

Dim DataYesterday(DataSize) As Integer
Dim DataToday(DataSize) As Integer
Dim DayIndex As Integer
Dim StartTime As Variant

Private Sub Form_Load()

    ' Mettre a True pour debugger, false en mode normal
    Simulation = True
    
    ' Commence en mode arrete
    BtnStop_Click
    
    If Not Simulation Then StartDevice
    
    ' Gain: 1=30V, 2=15V, 5=6V, 10=3V
    If Not Simulation Then
        SetGain 1, DataGain
        SetGain 2, DataGain
        SetGain 3, DataGain
        SetGain 4, DataGain
    End If
    
    DayIndex = 0
    ComboCanal.ListIndex = 0
    
    DrawPicture PictureToday, DataToday
    DrawPicture PictureYesterday, DataYesterday
    
    If Simulation Then
        Timer1.Interval = 1000 ' 1 second
    Else
        Timer1.Interval = 60 * 1000 ' 1 minute
    End If
    Timer1.Enabled = False
    
    If Simulation Then CheckSimulation.Value = 1
    
End Sub

Private Sub Form_Terminate()
    If Not Simulation Then StopDevice
End Sub

Private Sub CheckLED_Click()
    If CheckLED.Value = 1 Then LEDon Else LEDoff
End Sub

Private Sub CheckSimulation_Click()
    Simulation = (CheckSimulation.Value = 1)
End Sub

Private Sub BtnStart_Click()
    Timer1.Enabled = True
    StartTime = Time
    If Simulation Then
        LabelStatus.Caption = "Enregistrement (simulation)"
    Else
        LabelStatus.Caption = "Enregistrement en cours"
    End If
End Sub

Private Sub BtnStop_Click()
    Timer1.Enabled = False
    LabelStatus.Caption = "Arrêté"
End Sub

Private Sub Timer1_Timer()
    ReadOne
    If DayIndex >= DataSize Then
        SwitchNextDay
    End If
End Sub

Private Sub ReadOne()
    Dim i As Integer
    Dim s As String
    Dim t, h, m As Variant
    
    t = Time
    h = Hour(t)
    m = Minute(t)
    DayIndex = h * 60 + m
    LabelTime.Caption = Format(h, "00") + "h " + Format(m, "00")
    
    If Not Simulation Then
        ReadData DataBuffer(0)
    Else
        SimulateRead
    End If
    
    TextLoggerIndex.Text = Format(DataBuffer(0)) + "," + Format(DataBuffer(1))
    For i = 0 To 3
        TextVolt(i).Text = Format(DataVoltCoef * DataBuffer(2 + i), "0.0 V")
    Next


    Dim canal As Integer
    canal = ComboCanal.ListIndex
    If canal >= 0 And canal <= 3 Then
        ' canal 0..3 is data byte #2..6
        DataToday(DayIndex) = DataBuffer(canal + 2)
        
        DrawPicture PictureToday, DataToday
        DayIndex = DayIndex + 1
    End If
    
End Sub

Private Sub SwitchNextDay()
    Dim i As Integer
    
    ' Transfer today to yesterday
    For i = 0 To DataSize - 1
        DataYesterday(i) = DataToday(i)
        DataToday(i) = 0
    Next i
    DayIndex = 0
    DrawPicture PictureYesterday, DataYesterday
End Sub

Private Sub SimulateRead()
    Dim b, i As Integer
    Dim t1, t2 As Long
    
    t1 = Hour(Time) * 3600 + Minute(Time) * 60 + Second(Time)
    t2 = Hour(StartTime) * 3600 + Minute(StartTime) * 60 + Second(StartTime)
    DayIndex = (t1 - t2) Mod DataSize
    t1 = DayIndex Mod 60
    t2 = Int(DayIndex / 60)
    LabelTime.Caption = Format(t2, "00") + "h " + Format(t1, "00")
    
    b = 255 * ((Sin(DayIndex * 3.14159265385 * 6 / DataSize) + 1) / 2)
    For i = 0 To 5
        DataBuffer(i) = (b + 20 * i) Mod 256
    Next
End Sub

Private Sub DrawPicture(ByRef picbox As PictureBox, ByRef data() As Integer)
    Dim w, h As Integer
    Dim i, x, y, y1, y2, x1, x2 As Integer
    Dim xcoef, ycoef, tcoef As Double
    
    picbox.Refresh
    
    w = picbox.ScaleWidth
    h = picbox.ScaleHeight
    
    y1 = 0
    y2 = h - 1
    ycoef = (y2 - y1) / 255
    
    x1 = 0
    x2 = w - 1
    xcoef = (x2 - x1) / DataSize
    
    ' Couleurs: http://msdn.microsoft.com/en-us/library/d2dz8078(VS.80).aspx
    picbox.ForeColor = QBColor(8) ' gris
    
    picbox.Line (0, y1)-(w, y1)
    picbox.Line (0, y2)-(w, y2)

    tcoef = (x2 - x1) / 24
    For i = 0 To 24
        x = x1 + i * tcoef
        picbox.Line (x, y1 - 2)-(x, y2 + 2)
    Next

    picbox.ForeColor = QBColor(0) ' noir

    y = data(0) * ycoef
    picbox.CurrentX = 0
    picbox.CurrentY = y

    For i = 0 To DataSize - 1
        y = y2 - data(i) * ycoef
        x = x1 + i * xcoef
        picbox.Line -(x, y)
    Next i
End Sub
